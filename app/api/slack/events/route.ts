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
        const bodyJson = JSON.parse(body)

        if (bodyJson.type === 'url_verification') {
            return NextResponse.json({ challenge: bodyJson.challenge })
        }

        const signature = req.headers.get('x-slack-signature')
        const timestamp = req.headers.get('x-slack-request-timestamp')

        if (!signature || !timestamp) {
            return NextResponse.json({ error: 'missing signature' }, { status: 401 })
        }

        if (!verifySlackSignature(body, signature, timestamp)) {
            return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
        }

        // ✅ Acknowledge Slack immediately (must respond within 3 seconds)
        // Process the event in the background so the heavy RAG/OpenAI work doesn't block the response
        app.processEvent({
            body: bodyJson,
            ack: async () => { }
        }).catch((err) => {
            console.error('Background processEvent error:', err)
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('POST error:', error)
        return NextResponse.json({ error: 'internal error' }, { status: 500 })
    }
}