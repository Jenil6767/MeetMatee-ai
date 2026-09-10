import { getOrCreateUser } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ connected: false })
        }

        const user = await getOrCreateUser(userId)

        return NextResponse.json({
            connected: !!(user?.calendarConnected && user.googleAccessToken)
        })
    } catch (error) {
        return NextResponse.json({ connected: false })
    }
}