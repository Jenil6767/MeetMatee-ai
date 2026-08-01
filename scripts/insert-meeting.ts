import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  let user = await prisma.user.findFirst()
  if (!user) {
    console.log('No user found, creating a dummy user...')
    user = await prisma.user.create({
      data: {
        id: randomUUID(),
        clerkId: randomUUID(),
        email: 'test@example.com',
        calendarConnected: true,
      }
    })
  } else {
    console.log(`Using existing user with id: ${user.id}`)
  }

  const startTime = new Date(Date.now() + 30 * 60000)
  const endTime = new Date(Date.now() + 60 * 60000)

  const meeting = await prisma.meeting.create({
    data: {
      userId: user.id,
      title: 'Scheduled Meeting in 30 mins',
      startTime,
      endTime,
      isFromCalendar: true, // Needed for the query in route.ts
      meetingUrl: 'https://meet.google.com/bdd-uzxw-kps',
      attendees: JSON.stringify([
        { email: 'guest@example.com' }
      ]),
      botScheduled: true
    }
  })

  console.log('Successfully inserted meeting:', meeting)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
