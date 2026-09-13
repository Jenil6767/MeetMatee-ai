import { processMeetingTranscript } from "@/lib/ai-processor"
import { prisma } from "@/lib/db"
import { sendMeetingSummaryEmail } from "@/lib/email-service-free"
import { processTranscript } from "@/lib/rag"
import { uploadUrlToS3 } from "@/lib/s3"
import { transcribeFromUrl } from "@/lib/whisper"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    // 1. Verify Vercel Cron Secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        console.log('[Cron] Starting meeting processing job')

        // 2. Find all meetings that ended but haven't been processed yet,
        // and have a recording URL available.
        const pendingMeetings = await prisma.meeting.findMany({
            where: {
                meetingEnded: true,
                processed: false,
                recordingUrl: { not: null }
            },
            include: { user: true }
        })

        if (pendingMeetings.length === 0) {
            console.log('[Cron] No pending meetings to process.')
            return NextResponse.json({ success: true, processedCount: 0 })
        }

        console.log(`[Cron] Found ${pendingMeetings.length} meetings to process.`)
        let processedCount = 0

        // 3. Process each meeting
        for (const meeting of pendingMeetings) {
            try {
                console.log(`[Cron] Processing meeting: ${meeting.id}`)

                let finalTranscript: any = meeting.transcript || null
                let transcriptText = ''

                // Step A: Upload to S3 if it hasn't been uploaded yet (not an AWS URL)
                if (meeting.recordingUrl && !meeting.recordingUrl.includes('amazonaws.com')) {
                    try {
                        console.log(`[Cron] Uploading MP4 to S3 for meeting ${meeting.id}`)
                        meeting.recordingUrl = await uploadUrlToS3(meeting.recordingUrl, meeting.id)
                        await prisma.meeting.update({
                            where: { id: meeting.id },
                            data: { recordingUrl: meeting.recordingUrl }
                        })
                    } catch (s3Error) {
                        console.error(`[Cron] S3 upload failed for meeting ${meeting.id}:`, s3Error)
                    }
                }

                // Step B: Attempt Whisper Transcription if we don't have a valid array/string transcript
                // OR if we want to force Whisper. In our new flow, we prefer Whisper.
                if (meeting.recordingUrl) {
                    const whisperResult = await transcribeFromUrl(meeting.recordingUrl)
                    if (!whisperResult.skippedDueToSize && whisperResult.text.trim().length > 0) {
                        finalTranscript = whisperResult.text // Save raw string
                        transcriptText = whisperResult.text
                        console.log(`[Cron] Whisper transcription successful for ${meeting.id}`)
                    } else if (finalTranscript) {
                         // Fallback to existing transcript (Meeting BaaS)
                         console.log(`[Cron] Whisper skipped/failed. Using existing transcript for ${meeting.id}`)
                         if (Array.isArray(finalTranscript)) {
                             transcriptText = finalTranscript.map((item: any) => 
                                 `${item.speaker || 'Speaker'}: ${item.words?.map((w: any) => w.word).join(' ')}`
                             ).join('\n')
                         } else {
                             transcriptText = finalTranscript
                         }
                    }
                }

                // If no transcript from either source, clean up empty unattended meeting
                if (!transcriptText || transcriptText.trim().length === 0) {
                    console.log(`[Cron] No transcript available for ${meeting.id}. Removing empty meeting.`)
                    try {
                        await prisma.meeting.delete({
                            where: { id: meeting.id }
                        })
                        await prisma.user.update({
                            where: { id: meeting.userId },
                            data: {
                                meetingsThisMonth: {
                                    decrement: 1
                                }
                            }
                        }).catch(() => {})
                    } catch (delErr) {
                        await prisma.meeting.update({
                            where: { id: meeting.id },
                            data: {
                                processed: true,
                                processedAt: new Date(),
                                summary: 'No transcript was available for this meeting.',
                                actionItems: []
                            }
                        })
                    }
                    continue
                }

                // Step B: Save the transcript we got
                await prisma.meeting.update({
                    where: { id: meeting.id },
                    data: {
                        transcriptReady: true,
                        transcript: finalTranscript
                    }
                })

                // Step C: AI Processing
                const processed = await processMeetingTranscript(transcriptText)

                // Step D: Email
                if (meeting.user.email) {
                    try {
                        await sendMeetingSummaryEmail({
                            userEmail: meeting.user.email,
                            userName: meeting.user.name || 'User',
                            meetingTitle: meeting.title,
                            summary: processed.summary,
                            actionItems: processed.actionItems,
                            meetingId: meeting.id,
                            meetingDate: meeting.startTime.toLocaleDateString()
                        })
                        await prisma.meeting.update({
                            where: { id: meeting.id },
                            data: { emailSent: true, emailSentAt: new Date() }
                        })
                    } catch (emailErr) {
                         console.error(`[Cron] Email failed for ${meeting.id}:`, emailErr)
                    }
                }

                // Step E: RAG
                await processTranscript(meeting.id, meeting.userId, transcriptText, meeting.title)

                // Step F: Mark fully processed
                await prisma.meeting.update({
                    where: { id: meeting.id },
                    data: {
                        summary: processed.summary,
                        actionItems: processed.actionItems,
                        processed: true,
                        processedAt: new Date(),
                        ragProcessed: true,
                        ragProcessedAt: new Date()
                    }
                })
                
                processedCount++
                console.log(`[Cron] Successfully completed meeting ${meeting.id}`)

            } catch (err) {
                console.error(`[Cron] Failed to process meeting ${meeting.id}:`, err)
                // Mark as processed so it doesn't get stuck in an infinite retry loop forever
                await prisma.meeting.update({
                    where: { id: meeting.id },
                    data: {
                        processed: true,
                        processedAt: new Date(),
                        summary: 'Processing failed. Please check the transcript manually.',
                        actionItems: []
                    }
                })
            }
        }

        return NextResponse.json({ success: true, processedCount })

    } catch (error: any) {
        console.error('[Cron] Fatal error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
