import { PrismaClient } from "@prisma/client";
import { seedPomodoroSessions } from "./seeders/pomodoro-seeder";
import { seedHabits } from "./seeders/habits-seeder";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "laurynas@space.com" },
  });

  if (!user) throw new Error("User not found! Create a local user first.");

  await seedPomodoroSessions(prisma, user.id);
  await seedHabits(prisma, user.id);

  console.log("All seeding completed for user:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
