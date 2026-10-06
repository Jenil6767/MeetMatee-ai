import { prisma } from "@/lib/db"
import { isDuplicateEvent } from "../utils/deduplicate"

export async function handleAppMention({ event, say, client }: any) {
    try {
        console.log('[Slack Bot] Received app_mention event:', JSON.stringify(event))
        const eventId = `app_mention-${event.channel}-${event.user}`
        const eventTs = event.event_ts || event.ts

        if (isDuplicateEvent(eventId, eventTs)) {
            console.log('[Slack Bot] Duplicate event ignored:', eventId)
            return
        }

        const authTest = await client.auth.test()
        if (event.user === authTest.user_id) {
            console.log('[Slack Bot] Ignoring self-mention from bot')
            return
        }

        const slackUserId = event.user
        if (!slackUserId) {
            console.warn('[Slack Bot] Missing slackUserId in event')
            return
        }

        const text = event.text || ''
        const cleanText = text.replace(/<@[^>]+>/g, '').trim()
        console.log('[Slack Bot] Cleaned prompt text:', cleanText)

        if (!cleanText) {
            await say("👋 Hi! Ask me anything about your meetings. For example:\n· What were the key decisions in yesterday's meeting?\n· Summarize yesterday's meeting action items\n· Who attended the product planning session?")
            return
        }

        const userInfo = await client.users.info({ user: slackUserId })
        const userEmail = userInfo.user?.profile?.email
        console.log('[Slack Bot] User email from Slack profile:', userEmail)

        // Look up by slackUserId first (most reliable — works even if emails differ)
        // Then fall back to email matching
        let user = await prisma.user.findFirst({
            where: { slackUserId: slackUserId }
        })

        if (!user && userEmail) {
            console.log('[Slack Bot] slackUserId not found, trying email lookup:', userEmail)
            user = await prisma.user.findFirst({
                where: { email: userEmail }
            })
        }

        if (!user) {
            console.warn('[Slack Bot] No user found with email:', userEmail)
            await say({
                text: "Account not found",
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `👋 Hi! I couldn't find a MeetMatee account with email *${userEmail}*.\n\nPlease sign up first at MeetMatee, then you can chat with me here!`
                        }
                    },
                    {
                        type: "context",
                        elements: [{
                            type: "mrkdwn",
                            text: "Once you have an account, I can help you with meeting summaries, action items, and more!"
                        }]
                    }
                ]
            })
            return
        }

        const { team_id: teamId } = await client.auth.test()
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                slackUserId: slackUserId,
                slackTeamId: teamId as string,
                slackConnected: true
            }
        })

        await say("🤖 Searching through your meetings...")

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
            ? process.env.NEXT_PUBLIC_APP_URL
            : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://meetmatee.com')
        const ragUrl = `${baseUrl}/api/rag/chat-all`
        console.log('[Slack Bot] Querying RAG API at:', ragUrl)
        const response = await fetch(ragUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: cleanText,
                userId: user.id
            })
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error('[Slack Bot] RAG API failed:', response.status, errText)
            throw new Error(`RAG API failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.answer) {
            const answer = data.answer

            await say({
                text: "Meeting Assistant Response",
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `🤖 *Meeting Assistant*\n\n${answer}`
                        }
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "context",
                        elements: [{
                            type: "mrkdwn",
                            text: `💡 Ask me about meetings, decisions, action items or participants`
                        }]
                    },
                ]
            })
        } else {
            await say('Sorry, I encountered an error searching through your meetings.')
        }
    } catch (error) {
        console.error('[Slack Bot] App mention handler error:', error)
        await say('Sorry, something went wrong. Please try again.')
    }
}