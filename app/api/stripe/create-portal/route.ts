import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil'
})

export async function POST() {
    try {
        const { userId } = await auth()
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        })

        if (!user || !user.stripeCustomerId) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 400 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
        })

        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.error('Portal session creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
