"use server";

import { prisma } from "@/prisma/prisma";
import { requireAuth } from "@/server/server-utils";

function dayKeyToUTCDate(dayKey: string) {
  return new Date(`${dayKey}T00:00:00.000Z`);
}

export async function getTrackedHabits() {
  const userId = await requireAuth();

  return prisma.habitsTracker.findMany({
    where: { userId },
    include: { habit: true },
    orderBy: { order: "asc" },
  });
}

export async function getHabitCompletionsForDate(dateKey: string) {
  const userId = await requireAuth();
  const date = dayKeyToUTCDate(dateKey);

  return prisma.habitCompletion.findMany({
    where: {
      userId,
      date,
    },
    select: {
      habitId: true,
      completed: true,
    },
  });
}
