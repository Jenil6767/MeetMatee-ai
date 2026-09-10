import { getOrCreateUser } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'not authed' }, { status: 401 })
        }

        const user = await getOrCreateUser(userId)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            currentPlan: user.currentPlan,
            subscriptionStatus: user.subscriptionStatus,
            meetingsThisMonth: user.meetingsThisMonth,
            chatMessagesToday: user.chatMessagesToday,
            billingPeriodStart: user.billingPeriodStart,
        })
    } catch (error) {
        return NextResponse.json({ error: 'failed to fetch usaged' }, { status: 500 })
    }
}