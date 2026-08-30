import { App } from '@slack/bolt'
import { authorizeSlack } from './utils/slack-auth'
import { handleAppMention } from './handlers/app-mention'
import { handleMessage } from './handlers/message'
import { NextRequest, NextResponse } from 'next/server'
import { verifySlackSignature } from './utils/verifySlackSignature'

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    authorize: authorizeSlack
})

app.event('app_mention', handleAppMention)
app.message(handleMessage)

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()

        if (!body || !body.trim()) {
            console.warn('[Slack Events] Received empty POST body')
            return NextResponse.json({ error: 'empty body' }, { status: 400 })
        }

        let bodyJson: any
        try {
            bodyJson = JSON.parse(body)
        } catch (parseErr) {
            try {
                const params = new URLSearchParams(body)
                const payload = params.get('payload')
                if (payload) {
                    bodyJson = JSON.parse(payload)
                } else {
                    console.error('[Slack Events] Could not parse body as JSON or url-encoded payload:', body.slice(0, 100))
                    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
                }
            } catch {
                console.error('[Slack Events] Failed to parse request body')
                return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
            }
        }

        // Slack URL Verification (Event Subscriptions handshake)
        if (bodyJson.type === 'url_verification') {
            console.log('[Slack Events] Received URL verification challenge. Responding...')
            return NextResponse.json({ challenge: bodyJson.challenge })
        }

        const signature = req.headers.get('x-slack-signature')
        const timestamp = req.headers.get('x-slack-request-timestamp')

        if (!signature || !timestamp) {
            console.warn('[Slack Events] Missing signature or timestamp headers')
            return NextResponse.json({ error: 'missing signature' }, { status: 401 })
        }

        if (!verifySlackSignature(body, signature, timestamp)) {
            console.error('[Slack Events] Invalid signature verification')
            return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
        }

        console.log(`[Slack Events] Processing event type: ${bodyJson?.event?.type || bodyJson.type}`)

        // Await Slack event processing so Vercel Serverless execution context remains alive
        await app.processEvent({
            body: bodyJson,
            ack: async () => { }
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[Slack Events] Handler error:', error)
        return NextResponse.json({ error: 'internal error' }, { status: 500 })
    }
}