import { PrismaClient } from '@prisma/client';

// Standalone client for seeding (do NOT import ../prisma/prisma.ts)
const prisma = new PrismaClient();

async function main() {
  // Find your local user
  const user = await prisma.user.findUnique({
    where: { email: 'locacl@local.com' }, // replace with your local email
  });

  if (!user) throw new Error('User not found! Create a local user first.');

  // Create 10 example Pomodoro sessions
  const sessions = Array.from({ length: 10 }).map((_, i) => ({
    title: `Pomodoro Session ${i + 1}`,
    duration: 25 * 60,
    userId: user.id,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60), // spaced by 1 hour
    updatedAt: new Date(),
  }));

  for (const s of sessions) {
    await prisma.pomodoro.create({ data: s });
  }

  console.log('Seeded Pomodoro sessions for user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
