"use server";

import { prisma } from "@/prisma/prisma";
import { requireAuth, dayKeyToUTCDate } from "@/server/server-utils";

import { revalidatePath } from "next/cache";
const revalidate = () => revalidatePath("/habits-tracker");

export async function addHabitToTracker(habitId: string) {
  const userId = await requireAuth();

  await prisma.habitsTracker.upsert({
    where: {
      habitId_userId: {
        habitId,
        userId,
      },
    },
    update: {},
    create: {
      habitId,
      userId,
    },
  });

  revalidate();
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

  revalidate();
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

  revalidate();
}
