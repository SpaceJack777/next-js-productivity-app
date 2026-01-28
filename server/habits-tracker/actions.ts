"use server";

import { prisma } from "@/prisma/prisma";
import { requireAuth, dayKeyToUTCDate } from "@/server/server-utils";

export async function addHabitToTracker(habitId: string) {
  const userId = await requireAuth();

  await prisma.habitsTracker.create({
    data: {
      habitId,
      userId,
    },
  });
}

export async function toggleHabitCompletionAction(
  dateKey: string,
  updates: Record<string, boolean>,
) {
  const userId = await requireAuth();
  const date = dayKeyToUTCDate(dateKey);

  const entries = Object.entries(updates);
  if (entries.length === 0) return;

  await prisma.$transaction(
    entries.map(([habitId, completed]) =>
      prisma.habitCompletion.upsert({
        where: { habitId_userId_date: { habitId, userId, date } },
        update: { completed },
        create: { habitId, userId, date, completed },
      }),
    ),
  );
}

export async function removeHabitFromTracker(habitId: string) {
  const userId = await requireAuth();

  await prisma.$transaction([
    prisma.habitCompletion.deleteMany({
      where: {
        habitId,
        userId,
      },
    }),

    prisma.habitsTracker.deleteMany({
      where: {
        habitId,
        userId,
      },
    }),
  ]);
}
