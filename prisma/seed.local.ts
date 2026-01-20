import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "asdfasdfasdf@asdfasdf.lt" },
  });

  if (!user) throw new Error("User not found! Create a local user first.");

  // Create random Pomodoro sessions for the last 30 days
  const sessions = [];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Create between 20-40 sessions randomly distributed over the last 30 days
  const numSessions = Math.floor(Math.random() * 21) + 20; // 20-40 sessions

  for (let i = 0; i < numSessions; i++) {
    // Random date within the last 30 days
    const randomTime =
      thirtyDaysAgo.getTime() +
      Math.random() * (Date.now() - thirtyDaysAgo.getTime());
    const createdAt = new Date(randomTime);

    // Random duration between 25-60 minutes (in seconds)
    const duration = (Math.floor(Math.random() * 36) + 25) * 60;

    sessions.push({
      title: `Focus Session ${i + 1}`,
      duration,
      userId: user.id,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Sort by creation date
  sessions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  for (const s of sessions) {
    await prisma.pomodoro.create({ data: s });
  }

  console.log("Seeded Pomodoro sessions for user:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
