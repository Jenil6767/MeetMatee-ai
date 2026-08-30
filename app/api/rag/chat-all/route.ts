import { prisma } from "@/lib/db";
import { chatWithAllMeetings } from "@/lib/rag";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { question, userId: slackUserId } = await request.json()

        if (!question) {
            return NextResponse.json({ error: 'missing question' }, { status: 400 })
        }

        let targetUserIds: string[] = []

        if (!slackUserId) {
            const { userId: clerkUserId } = await auth()
            if (!clerkUserId) {
                return NextResponse.json({ error: 'not logged in' }, { status: 401 })
            }

            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { clerkId: clerkUserId },
                        { id: clerkUserId }
                    ]
                },
                select: { id: true, clerkId: true }
            })

            if (user) {
                targetUserIds = Array.from(new Set([user.id, user.clerkId, clerkUserId].filter(Boolean) as string[]))
            } else {
                targetUserIds = [clerkUserId]
            }
        } else {
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { id: slackUserId },
                        { clerkId: slackUserId },
                        { slackUserId: slackUserId }
                    ]
                },
                select: { id: true, clerkId: true }
            })

            if (user) {
                targetUserIds = Array.from(new Set([user.id, user.clerkId, slackUserId].filter(Boolean) as string[]))
            } else {
                targetUserIds = [slackUserId]
            }
        }


        const response = await chatWithAllMeetings(targetUserIds, question)

        return NextResponse.json(response)
    } catch (error) {
        console.error('error in chat:', error)
        return NextResponse.json({
            error: 'failed to process question',
            answer: "I encountered an error while searching your meetings. please try again."
        }, { status: 500 })
    }
}