import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📩 [Stripe Webhook] Incoming request')

    try {
        const body = await request.text()
        const headersList = await headers()
        const sig = headersList.get('stripe-signature')!

        console.log('🔑 [Stripe Webhook] Signature present:', !!sig)
        console.log('🔑 [Stripe Webhook] Secret present:', !!webhookSecret)

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
            console.log(`✅ [Stripe Webhook] Event verified: ${event.type} (id: ${event.id})`)
        } catch (error) {
            console.error('❌ [Stripe Webhook] Signature verification FAILED:', error)
            return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
        }

        switch (event.type) {
            case 'checkout.session.completed':
                console.log('▶️ [Stripe Webhook] Handling: checkout.session.completed')
                await handleCheckoutCompleted(event.data.object)
                break
            case 'customer.subscription.created':
                console.log('▶️ [Stripe Webhook] Handling: customer.subscription.created')
                await handleSubscriptionCreated(event.data.object)
                break
            case 'customer.subscription.updated':
                console.log('▶️ [Stripe Webhook] Handling: customer.subscription.updated')
                await handleSubscriptionUpdated(event.data.object)
                break
            case 'customer.subscription.deleted':
                console.log('▶️ [Stripe Webhook] Handling: customer.subscription.deleted')
                await handleSubscriptionCancelled(event.data.object)
                break
            case 'invoice.payment_succeeded':
                console.log('▶️ [Stripe Webhook] Handling: invoice.payment_succeeded')
                await handlePaymentSucceeded(event.data.object)
                break
            default:
                console.log(`⚠️ [Stripe Webhook] Unhandled event type: ${event.type}`)
        }

        console.log('✅ [Stripe Webhook] Done processing event:', event.type)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('❌ [Stripe Webhook] Unhandled error:', error)
        return NextResponse.json({ error: 'webhook failed' }, { status: 500 })
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    try {
        console.log('🔍 [checkout.session.completed] Session ID:', session.id)
        console.log('🔍 [checkout.session.completed] Customer ID:', session.customer)
        console.log('🔍 [checkout.session.completed] Metadata:', JSON.stringify(session.metadata))

        const customerId = session.customer as string | null
        const planName = (session.metadata?.planName || '').toLowerCase().trim()
        const dbUserId = session.metadata?.dbUserId
        const clerkUserId = session.metadata?.clerkUserId

        // Detect Stripe CLI test triggers which have no customer and empty metadata
        if (!customerId && (!session.metadata || Object.keys(session.metadata).length === 0)) {
            console.log('⚠️ [checkout.session.completed] Received empty session without metadata or customer. This appears to be a Stripe CLI test trigger event. Ignoring gracefully.')
            return
        }

        console.log(`🔍 [checkout.session.completed] planName="${planName}" dbUserId="${dbUserId}" clerkUserId="${clerkUserId}"`)

        if (!planName || !['starter', 'pro', 'premium'].includes(planName)) {
            console.error('❌ [checkout.session.completed] Invalid or missing planName:', planName)
            return
        }

        // Primary lookup: by stripeCustomerId
        let user = null
        if (customerId) {
            user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
            console.log(`🔍 [checkout.session.completed] User found by stripeCustomerId: ${!!user}`)
        }

        // Fallback 1: by dbUserId from metadata
        if (!user && dbUserId) {
            user = await prisma.user.findUnique({ where: { id: dbUserId } })
            console.log(`🔍 [checkout.session.completed] User found by dbUserId fallback: ${!!user}`)
        }

        // Fallback 2: by clerkId from metadata
        if (!user && clerkUserId) {
            user = await prisma.user.findFirst({ where: { clerkId: clerkUserId } })
            console.log(`🔍 [checkout.session.completed] User found by clerkId fallback: ${!!user}`)
        }

        if (!user) {
            console.error(`❌ [checkout.session.completed] No user found for customerId=${customerId}, dbUserId=${dbUserId}, clerkUserId=${clerkUserId}`)
            return
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                currentPlan: planName,
                subscriptionStatus: 'active',
                stripeCustomerId: customerId, // Ensure saved even if found via fallback
                stripeSubscriptionId: session.subscription as string,
                billingPeriodStart: new Date(),
                meetingsThisMonth: 0,
                chatMessagesToday: 0
            }
        })
        console.log(`✅ [checkout.session.completed] Updated user=${user.id} → plan=${planName}, status=active`)
    } catch (error) {
        console.error('❌ [checkout.session.completed] Error:', error)
    }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
    try {
        console.log('🔍 [subscription.created] Subscription ID:', subscription.id)
        console.log('🔍 [subscription.created] Customer ID:', subscription.customer)
        console.log('🔍 [subscription.created] Metadata:', JSON.stringify(subscription.metadata))
        console.log('🔍 [subscription.created] Status:', subscription.status)

        const customerId = subscription.customer as string
        const planName = getPlanFromSubscription(subscription)

        console.log(`🔍 [subscription.created] Resolved planName="${planName}"`)

        const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
        console.log(`🔍 [subscription.created] User found by stripeCustomerId: ${!!user}`)

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    currentPlan: planName,
                    subscriptionStatus: 'active',
                    stripeSubscriptionId: subscription.id,
                    billingPeriodStart: new Date(),
                    meetingsThisMonth: 0,
                    chatMessagesToday: 0
                }
            })
            console.log(`✅ [subscription.created] Updated user=${user.id} → plan=${planName}`)
        } else {
            console.error(`❌ [subscription.created] No user found for stripeCustomerId=${customerId}`)
        }
    } catch (error) {
        console.error('❌ [subscription.created] Error:', error)
    }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    try {
        console.log('🔍 [subscription.updated] Subscription ID:', subscription.id)
        console.log('🔍 [subscription.updated] Status:', subscription.status)

        const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: subscription.id } })
        console.log(`🔍 [subscription.updated] User found by subscriptionId: ${!!user}`)

        if (user) {
            const planName = getPlanFromSubscription(subscription)
            const newStatus = subscription.status === 'active' ? 'active' : 'cancelled'
            await prisma.user.update({
                where: { id: user.id },
                data: { currentPlan: planName, subscriptionStatus: newStatus }
            })
            console.log(`✅ [subscription.updated] Updated user=${user.id} → plan=${planName}, status=${newStatus}`)
        } else {
            console.error(`❌ [subscription.updated] No user found for subscriptionId=${subscription.id}`)
        }
    } catch (error) {
        console.error('❌ [subscription.updated] Error:', error)
    }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
    try {
        console.log('🔍 [subscription.deleted] Subscription ID:', subscription.id)

        const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: subscription.id } })
        console.log(`🔍 [subscription.deleted] User found: ${!!user}`)

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { subscriptionStatus: 'cancelled', currentPlan: 'free' }
            })
            console.log(`✅ [subscription.deleted] User=${user.id} set to free/cancelled`)
        } else {
            console.error(`❌ [subscription.deleted] No user found for subscriptionId=${subscription.id}`)
        }
    } catch (error) {
        console.error('❌ [subscription.deleted] Error:', error)
    }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    try {
        const subscriptionId = (invoice as any).subscription as string | null
        console.log('🔍 [invoice.payment_succeeded] SubscriptionId:', subscriptionId)

        if (subscriptionId) {
            const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: subscriptionId } })
            console.log(`🔍 [invoice.payment_succeeded] User found: ${!!user}`)

            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        subscriptionStatus: 'active',
                        billingPeriodStart: new Date(),
                        meetingsThisMonth: 0
                    }
                })
                console.log(`✅ [invoice.payment_succeeded] Renewed user=${user.id}`)
            } else {
                console.error(`❌ [invoice.payment_succeeded] No user found for subscriptionId=${subscriptionId}`)
            }
        }
    } catch (error) {
        console.error('❌ [invoice.payment_succeeded] Error:', error)
    }
}

function getPlanFromSubscription(subscription: Stripe.Subscription) {
    // Prefer metadata set at checkout (most reliable)
    const metaPlan = subscription.metadata?.planName?.toLowerCase().trim()
    console.log(`🔍 [getPlanFromSubscription] metadata.planName="${metaPlan}"`)

    if (metaPlan === 'starter' || metaPlan === 'pro' || metaPlan === 'premium') {
        return metaPlan
    }

    const priceId = subscription.items.data[0]?.price.id
    console.log(`🔍 [getPlanFromSubscription] priceId="${priceId}"`)

    const priceToPlan: Record<string, string> = {
        [process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY!]: 'starter',
        [process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY!]: 'pro',
        [process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY!]: 'premium',
    }

    const resolved = (priceId && priceToPlan[priceId]) || 'free'
    console.log(`🔍 [getPlanFromSubscription] resolved plan="${resolved}"`)
    return resolved
}