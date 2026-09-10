import { prisma } from "@/lib/db"
import { getOrCreateUser } from "@/lib/user"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const url = new URL(request.url)
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')
        const error = url.searchParams.get('error')

        if (error) {
            console.error('oauth error', error)
            return NextResponse.redirect(new URL('/home?error=oauth_denied', request.url))
        }

        if (!code || !state) {
            console.error('missing code or state ')
            return NextResponse.redirect(new URL('/home?error=oauth_failed', request.url))
        }

        const { userId } = JSON.parse(Buffer.from(state, 'base64').toString())

        // Dynamically determine redirect URI based on current request host
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host || ''
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

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            })
        })

        const tokens = await tokenResponse.json()

        if (!tokens.access_token) {
            console.error('no access token received', tokens)
            return NextResponse.redirect(new URL('/home?error=no_access_token', request.url))
        }

        // Dynamically get or create user record for whoever is logged in
        const user = await getOrCreateUser(userId)

        if (!user) {
            console.error('user not found', userId)
            return NextResponse.redirect(new URL('/home?error=user_not_found', request.url))
        }

        await prisma.user.update({
            where: {
                clerkId: userId
            },
            data: {
                googleAccessToken: tokens.access_token,
                googleRefreshToken: tokens.refresh_token,
                calendarConnected: true,
                googleTokenExpiry: new Date(Date.now() + (tokens.expires_in * 1000))
            }
        })


        return NextResponse.redirect(new URL('/home?connected=direct', request.url))
    } catch (error) {
        console.error('callback error: ', error)
        return NextResponse.redirect(new URL('/home?error=callback_failed', request.url))
    }
}