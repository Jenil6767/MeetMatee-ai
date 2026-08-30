import crypto from 'crypto'

export function verifySlackSignature(body: string, signature: string, timestamp: string): boolean {
    const signingSecret = process.env.SLACK_SIGNING_SECRET
    if (!signingSecret) {
        console.error('[Slack Events] SLACK_SIGNING_SECRET is not configured in .env')
        return false
    }

    const time = Math.floor(new Date().getTime() / 1000)
    const requestTime = parseInt(timestamp, 10)
    if (isNaN(requestTime) || Math.abs(time - requestTime) > 300) {
        console.error('[Slack Events] Timestamp expired or invalid:', timestamp)
        return false
    }

    const sigBaseString = `v0:${timestamp}:${body}`

    const mySignature = 'v0=' + crypto
        .createHmac('sha256', signingSecret)
        .update(sigBaseString, 'utf8')
        .digest('hex')

    const mySigBuf = Buffer.from(mySignature, 'utf8')
    const sigBuf = Buffer.from(signature, 'utf8')

    if (mySigBuf.length !== sigBuf.length) {
        console.error('[Slack Events] Signature length mismatch')
        return false
    }

    return crypto.timingSafeEqual(mySigBuf, sigBuf)
}