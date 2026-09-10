import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }

        const state = Buffer.from(JSON.stringify({ userId })).toString('base64')

        // Dynamically determine redirect URI based on current request host
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
        const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
        const currentOrigin = `${proto}://${host}`

        let redirectUri = `${currentOrigin}/api/auth/google/callback`
        if (process.env.GOOGLE_REDIRECT_URI) {
            if (host.includes('localhost')) {
                redirectUri = process.env.GOOGLE_REDIRECT_URI
            } else if (!process.env.GOOGLE_REDIRECT_URI.includes('localhost')) {
                redirectUri = process.env.GOOGLE_REDIRECT_URI
            }
        }

        const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
        googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!)
        googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
        googleAuthUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar.readonly')
        googleAuthUrl.searchParams.set('response_type', 'code')
        googleAuthUrl.searchParams.set('access_type', 'offline')
        googleAuthUrl.searchParams.set('prompt', 'consent')
        googleAuthUrl.searchParams.set('state', state)

        return NextResponse.redirect(googleAuthUrl.toString())
    } catch (error) {
        console.error('Direct OAuth error:', error)
        return NextResponse.json({ error: "Failed to setup OAuth" }, { status: 500 })
    }
}