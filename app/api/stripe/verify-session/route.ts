import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil'
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'not authenticated' }, { status: 401 });
        }

        const { session_id } = await request.json();
        if (!session_id) {
            return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== 'paid' && session.status !== 'complete') {
            return NextResponse.json({ error: 'payment not completed' }, { status: 400 });
        }

        const customerId = session.customer as string | null;
        const planName = (session.metadata?.planName || '').toLowerCase().trim();
        const dbUserId = session.metadata?.dbUserId;

        if (!planName || !['starter', 'pro', 'premium'].includes(planName)) {
            return NextResponse.json({ error: 'invalid plan name in session' }, { status: 400 });
        }

        let user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'user not found in db' }, { status: 404 });
        }

        // Only update if the webhook hasn't already done it for this specific subscription
        // Or if the plan is currently different (to prevent race condition)
        if (user.currentPlan !== planName || user.stripeSubscriptionId !== session.subscription) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    currentPlan: planName,
                    subscriptionStatus: 'active',
                    stripeCustomerId: customerId || user.stripeCustomerId,
                    stripeSubscriptionId: (session.subscription as string) || user.stripeSubscriptionId,
                    billingPeriodStart: new Date(),
                    meetingsThisMonth: 0, // Reset usage on upgrade
                    chatMessagesToday: 0
                }
            });
            console.log(`[verify-session] Manually updated user ${userId} to plan ${planName}`);
        }

        return NextResponse.json({ success: true, plan: planName });
    } catch (error) {
        console.error('verify session error:', error);
        return NextResponse.json({ error: 'failed to verify session' }, { status: 500 });
    }
}
