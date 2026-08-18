import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const meeting = await prisma.meeting.findUnique({
    where: { id: 'cmsyn28bw0003sll7yae0rpv4' }
  });
  console.log('RECORDING_URL:', meeting?.recordingUrl);
  await prisma.$disconnect();
}
run();
