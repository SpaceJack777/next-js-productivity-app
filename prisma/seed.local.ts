import { PrismaClient } from "@prisma/client";
import { seedPomodoroSessions } from "./seeders/pomodoro-seeder";
import { seedHabits } from "./seeders/habits-seeder";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("adminadmin", 10);

  const user = await prisma.user.upsert({
    where: { email: "laurynas@space.com" },
    update: {},
    create: {
      email: "laurynas@space.com",
      name: "Laurynas",
      password: hashedPassword,
    },
  });

  console.log("User created/found:", user.email);

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
