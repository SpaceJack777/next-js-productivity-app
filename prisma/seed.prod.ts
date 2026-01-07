// prisma/seed.prod.ts - Production database seeding
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting production database seeding...");

  try {
    // Get all users that don't have timer settings yet
    const usersWithoutSettings = await prisma.user.findMany({
      where: {
        timerSettings: null, // Only users without timer settings
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (usersWithoutSettings.length === 0) {
      console.log(
        "✅ All users already have timer settings. Skipping seeding.",
      );
      return;
    }

    console.log(
      `📊 Found ${usersWithoutSettings.length} users without timer settings`,
    );

    // Create default timer settings for users who don't have them
    const settingsToCreate = usersWithoutSettings.map((user) => ({
      userId: user.id,
      focusSession: 25, // Default focus session: 25 minutes
      shortBreak: 5, // Default short break: 5 minutes
      longBreak: 15, // Default long break: 15 minutes
    }));

    // Use createMany for better performance
    const result = await prisma.userTimerSettings.createMany({
      data: settingsToCreate,
      skipDuplicates: true, // Extra safety in case of race conditions
    });

    console.log(
      `✅ Successfully created timer settings for ${result.count} users`,
    );

    // Log summary
    console.log("🎯 Production seeding completed successfully!");
    console.log(`   - Users processed: ${usersWithoutSettings.length}`);
    console.log(`   - Settings created: ${result.count}`);
    console.log(
      `   - Default settings: Focus 25min, Short break 5min, Long break 15min`,
    );
  } catch (error) {
    console.error("❌ Production seeding failed:", error);
    throw error; // Re-throw to ensure the script exits with error code
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
