-- CreateTable
CREATE TABLE "user_timer_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "focusSession" INTEGER NOT NULL DEFAULT 25,
    "shortBreak" INTEGER NOT NULL DEFAULT 5,
    "longBreak" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_timer_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_timer_settings_userId_key" ON "user_timer_settings"("userId");

-- AddForeignKey
ALTER TABLE "user_timer_settings" ADD CONSTRAINT "user_timer_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
