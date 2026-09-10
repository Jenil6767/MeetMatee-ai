import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'


export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "not authed" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
        const limit = Math.max(1, parseInt(searchParams.get('limit') || '5', 10))
        const skip = (page - 1) * limit

        const user = await getOrCreateUser(userId)

        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 404 })
        }

        const search = searchParams.get('search') || ''

        const where: any = {
            userId: user.id,
            meetingEnded: true
        }

        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive'
            }
        }

        const [pastMeetings, total] = await Promise.all([
            prisma.meeting.findMany({
                where,
                orderBy: { endTime: 'desc' },
                skip,
                take: limit,
            }),
            prisma.meeting.count({ where })
        ])

        return NextResponse.json({
            meetings: pastMeetings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        })

    } catch (error) {
        return NextResponse.json({ error: 'failed to fetch past meetings', meetings: [] }, { status: 500 })
    }
}