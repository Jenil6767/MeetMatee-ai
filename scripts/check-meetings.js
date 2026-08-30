const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkMeetings() {
    try {
        // Find meetmateesaas user
        const user = await prisma.user.findFirst({
            where: { email: 'meetmateesaas@gmail.com' },
            select: { id: true, clerkId: true, email: true, slackUserId: true }
        })
        console.log('MeetMatee user:', JSON.stringify(user, null, 2))

        if (!user) { console.log('User not found'); return }

        // Find meetings by DB id
        const meetingsById = await prisma.meeting.findMany({
            where: { userId: user.id },
            select: { id: true, title: true, userId: true, processed: true, meetingEnded: true }
        })
        console.log('\nMeetings by DB id:', meetingsById.length, JSON.stringify(meetingsById, null, 2))

        // Find meetings by clerkId
        const meetingsByClerk = await prisma.meeting.findMany({
            where: { userId: user.clerkId },
            select: { id: true, title: true, userId: true, processed: true, meetingEnded: true }
        })
        console.log('\nMeetings by clerkId:', meetingsByClerk.length, JSON.stringify(meetingsByClerk, null, 2))

        // Show all meetings and their userIds to see what's stored
        const allMeetings = await prisma.meeting.findMany({
            select: { id: true, title: true, userId: true, processed: true, meetingEnded: true },
            take: 10,
            orderBy: { createdAt: 'desc' }
        })
        console.log('\nAll recent meetings:')
        allMeetings.forEach(m => console.log(`  title: ${m.title}, userId: ${m.userId}, processed: ${m.processed}, ended: ${m.meetingEnded}`))
    } catch (e) {
        console.error('Error:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

checkMeetings()
