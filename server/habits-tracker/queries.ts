"use server";

import { prisma } from "@/prisma/prisma";
import { requireAuth } from "@/server/server-utils";
import { dayKeyToUTCDate } from "@/server/server-utils";

export async function getTrackedHabitIds() {
  const userId = await requireAuth();

  const rows = await prisma.habitsTracker.findMany({
    where: { userId },
    select: { habitId: true },
  });

  return rows.map((r) => r.habitId);
}

export async function getTrackedHabits() {
  const userId = await requireAuth();

  return prisma.habitsTracker.findMany({
    where: { userId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      habit: {
        select: {
          id: true,
          icon: true,
          name: true,
          description: true,
        },
      },
    },
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

export async function getProgressByDayKey(
  dayKeys: string[],
  totalHabits: number,
) {
  const userId = await requireAuth();
  const dates = dayKeys.map(dayKeyToUTCDate);

  const completions = await prisma.habitCompletion.findMany({
    where: { userId, date: { in: dates }, completed: true },
    select: { date: true },
  });

  const counts: Record<string, number> = Object.fromEntries(
    dayKeys.map((k) => [k, 0]),
  );

  for (const { date } of completions) {
    const key = date.toISOString().slice(0, 10);
    counts[key]++;
  }

  return Object.fromEntries(
    dayKeys.map((k) => [k, totalHabits ? counts[k] / totalHabits : 0]),
  );
}
