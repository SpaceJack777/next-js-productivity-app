/*
  Warnings:

  - You are about to drop the column `completed` on the `Pomodoro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pomodoro" DROP COLUMN "completed";

-- CreateTable
CREATE TABLE "notes_folders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Folder',
    "parentId" TEXT,
    "userId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notes_folders_userId_idx" ON "notes_folders"("userId");

-- CreateIndex
CREATE INDEX "notes_folders_parentId_idx" ON "notes_folders"("parentId");

-- CreateIndex
CREATE INDEX "notes_userId_idx" ON "notes"("userId");

-- CreateIndex
CREATE INDEX "notes_folderId_idx" ON "notes"("folderId");

-- AddForeignKey
ALTER TABLE "notes_folders" ADD CONSTRAINT "notes_folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_folders" ADD CONSTRAINT "notes_folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "notes_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "notes_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
