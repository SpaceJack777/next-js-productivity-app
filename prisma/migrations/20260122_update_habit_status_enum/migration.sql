-- CreateEnum
CREATE TYPE "HabitStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "habits" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "habits" ALTER COLUMN "status" TYPE "HabitStatus" USING (CASE WHEN "status" = 'active' THEN 'active'::"HabitStatus" ELSE 'inactive'::"HabitStatus" END);
ALTER TABLE "habits" ALTER COLUMN "status" SET DEFAULT 'active';
