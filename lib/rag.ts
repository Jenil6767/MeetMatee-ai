import { prisma } from "./db";
import { chatWithAI, createEmbedding, createManyEmbeddings } from "./openai";
import { saveManyVectors, searchVectors } from "./pinecone";
import { chunkTranscript, extractSpeaker } from "./text-chunker";

export async function processTranscript(
    meetingId: string,
    userId: string,
    transcript: string,
    meetingTitle?: string
) {
    const chunks = chunkTranscript(transcript)

    const texts = chunks.map(chunk => chunk.content)

    const embeddings = await createManyEmbeddings(texts)

    const dbChunks = chunks.map((chunk) => ({
        meetingId,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        speakerName: extractSpeaker(chunk.content),
        vectorId: `${meetingId}_chunk_${chunk.chunkIndex}`
    }))

    await prisma.transcriptChunk.createMany({
        data: dbChunks,
        skipDuplicates: true
    })

    const vectors = chunks.map((chunk, index) => ({
        id: `${meetingId}_chunk_${chunk.chunkIndex}`,
        embedding: embeddings[index],
        metadata: {
            meetingId,
            userId,
            chunkIndex: chunk.chunkIndex,
            content: chunk.content,
            speakerName: extractSpeaker(chunk.content) || 'Speaker',
            meetingTitle: meetingTitle || 'Untitled Meeting'

        }
    }))

    await saveManyVectors(vectors)
}

export async function chatWithMeeting(
    userId: string,
    meetingId: string,
    question: string
) {
    const questionEmbedding = await createEmbedding(question)

    const results = await searchVectors(
        questionEmbedding,
        { userId, meetingId },
        5
    )

    const meeting = await prisma.meeting.findUnique({
        where: {
            id: meetingId
        }
    })

    const context = results
        .map(result => {
            const speaker = result.metadata?.speakerName || 'Unknown'
            const content = result.metadata?.content || ''
            return `${speaker}: ${content}`
        })
        .join('\n\n')

    const systemPrompt = `You are helping someone understand their meeting.
    Meeting: ${meeting?.title || 'Untitled Meeting'}
    Date: ${meeting?.createdAt ? new Date(meeting.createdAt).toDateString() : 'Unknown'}

    Here's what was discussed:
    ${context}

    Answer the user's question based only on the meeting content above. If the answer isn't in the meeting, say so`

    const answer = await chatWithAI(systemPrompt, question)

    return {
        answer,
        sources: results.map(result => ({
            meetingId: result.metadata?.meetingId,
            content: result.metadata?.content,
            speakerName: result.metadata?.speakerName,
            confidence: result.score
        }))
    }
}

/**
 * Detect questions that need a real chronological meeting list
 * (e.g. "latest meeting", "last meeting", "recent meetings").
 * These must NOT rely on Pinecone similarity alone.
 */
export function isMeetingTimelineQuestion(question: string): boolean {
    const q = question.toLowerCase().trim()

    const timelinePatterns = [
        /\b(latest|last|most recent|previous|recent)\b.*\bmeetings?\b/,
        /\bmeetings?\b.*\b(latest|last|most recent|previous|recent)\b/,
        /\b(what|which)\s+(was|is|were|are)\s+(my\s+)?(the\s+)?(latest|last|most recent|previous|recent)\b/,
        /\b(recent|past|previous)\b.*\bmeetings?\b/,
        /\blist\b.*\b(my\s+)?meetings?\b/,
        /\b(my\s+)?(last|latest|most recent)\s+meetings?\b/,
        /\bwhen\b.*\b(last|latest)\b.*\bmeetings?\b/,
        /\bwhat\s+happened\s+(in|during|at)\s+(my\s+)?(the\s+)?(last|latest|most recent)\b/,
        /\b(summary|overview|details|action items|agenda)\s+of\s+(my\s+)?(the\s+)?(last|latest|most recent)\b/,
        /\btell\s+me\s+about\s+(my\s+)?(the\s+)?(last|latest|most recent)\b/,
        /\bwho\s+attended\s+(my\s+)?(the\s+)?(last|latest|most recent)\b/,
    ]

    return timelinePatterns.some((pattern) => pattern.test(q))
}

function formatActionItems(actionItems: unknown): string {
    if (!actionItems) return 'None recorded'

    if (typeof actionItems === 'string') {
        return actionItems || 'None recorded'
    }

    if (Array.isArray(actionItems)) {
        const lines = actionItems
            .map((item: any) => {
                if (typeof item === 'string') return `• ${item}`
                if (item?.text) return `• ${item.text}`
                return null
            })
            .filter(Boolean)

        return lines.length > 0 ? lines.join('\n') : 'None recorded'
    }

    return 'None recorded'
}

async function answerMeetingTimelineQuestion(userIdInput: string | string[], question: string) {
    const userIds = Array.isArray(userIdInput) ? userIdInput : [userIdInput]

    let meetings = await prisma.meeting.findMany({
        where: {
            userId: { in: userIds },
            meetingEnded: true,
        },
        orderBy: [
            { startTime: 'desc' },
            { endTime: 'desc' },
            { createdAt: 'desc' },
        ],
        take: 10,
        select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
            summary: true,
            actionItems: true,
            attendees: true,
            processed: true,
        },
    })

    if (meetings.length === 0) {
        meetings = await prisma.meeting.findMany({
            where: {
                userId: { in: userIds },
            },
            orderBy: [
                { startTime: 'desc' },
                { createdAt: 'desc' },
            ],
            take: 10,
            select: {
                id: true,
                title: true,
                startTime: true,
                endTime: true,
                summary: true,
                actionItems: true,
                attendees: true,
                processed: true,
            },
        })
    }

    if (meetings.length === 0) {
        return {
            answer:
                "I couldn't find any meetings for your account yet. Once a meeting finishes and is processed, I can tell you which one was latest.",
            sources: [],
        }
    }

    const latest = meetings[0]

    const context = meetings
        .map((meeting, index) => {
            const start = meeting.startTime
                ? new Date(meeting.startTime).toLocaleString()
                : 'Unknown'
            const end = meeting.endTime
                ? new Date(meeting.endTime).toLocaleString()
                : 'Unknown'
            const summary = meeting.summary || 'Summary not available yet'
            const actionItems = formatActionItems(meeting.actionItems)
            const attendees = Array.isArray(meeting.attendees)
                ? meeting.attendees
                      .map((a: any) =>
                          typeof a === 'string' ? a : a?.name || a?.email || null
                      )
                      .filter(Boolean)
                      .join(', ') || 'Not listed'
                : 'Not listed'

            return [
                `${index + 1}. Meeting ID: ${meeting.id}`,
                `Title: ${meeting.title || 'Untitled Meeting'}`,
                `Start: ${start}`,
                `End: ${end}`,
                `Attendees: ${attendees}`,
                `Summary: ${summary}`,
                `Action Items:\n${actionItems}`,
            ].join('\n')
        })
        .join('\n\n---\n\n')

    const systemPrompt = `You are helping someone understand their meeting history.

Below is their completed meetings from the database, already sorted newest-first by start time/end time.
Meeting #1 is always the latest/last meeting.

Completed meetings:
${context}

Rules:
- For questions about the latest/last/most recent meeting, use Meeting #1 ("${latest.title || 'Untitled Meeting'}").
- Do not invent meetings that are not in this list.
- Do not reorder by guessing chronology from text; trust this ordered list.
- If asked for a list, present them in this same newest-first order.
- Keep answers concise and mention meeting titles and dates.`

    const answer = await chatWithAI(systemPrompt, question)

    return {
        answer,
        sources: meetings.map((meeting) => ({
            meetingId: meeting.id,
            meetingTitle: meeting.title || 'Untitled Meeting',
            content: meeting.summary || '',
            speakerName: null,
            confidence: 1,
        })),
    }
}

export async function chatWithAllMeetings(
    userIdInput: string | string[],
    question: string
) {
    const userIds = Array.isArray(userIdInput) ? userIdInput : [userIdInput]
    const primaryUserId = userIds[0]

    // Timeline questions need DB order-by-date, not vector similarity.
    if (isMeetingTimelineQuestion(question)) {
        return answerMeetingTimelineQuestion(userIds, question)
    }

    const questionEmbedding = await createEmbedding(question)

    const results = await searchVectors(
        questionEmbedding,
        { userId: primaryUserId },
        8
    )

    const context = results
        .map(result => {
            const meetingTitle = result.metadata?.meetingTitle || 'Untitled Meeting'
            const speaker = result.metadata?.speakerName || 'Unknown'
            const content = result.metadata?.content || ''
            return `Meeting: ${meetingTitle}\n${speaker}: ${content}`
        })
        .join('\n\n---\n\n')

    const systemPrompt = `You are helping someone understand their meeting history.
    
    Here's what was discussed across their meetings:
    ${context}

    Answer the user's question based only on the meeting content above. When you reference something, mention which meetings its from.`

    const answer = await chatWithAI(systemPrompt, question)

    return {
        answer,
        sources: results.map(result => ({
            meetingId: result.metadata?.meetingId,
            meetingTitle: result.metadata?.meetingTitle,
            content: result.metadata?.content,
            speakerName: result.metadata?.speakerName,
            confidence: result.score
        }))
    }
}