import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Routes that are always public (no auth needed)
const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/privacy-policy',
    '/terms',
    '/cookie',
    '/api/webhooks/(.*)',
    '/api/slack/(.*)',
    '/api/rag/(.*)',
    '/api/auth/(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()
    const { pathname } = req.nextUrl

    // If not signed in and trying to access any non-public route → redirect to sign-in
    if (!userId && !isPublicRoute(req)) {
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', req.url)
        return NextResponse.redirect(signInUrl)
    }

    // If already signed in and visiting sign-in/sign-up → redirect to landing page
    if (userId && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
        return NextResponse.redirect(new URL('/', req.url))
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}