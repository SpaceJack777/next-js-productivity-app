"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma/prisma";
import { requireAuth, dayKeyToUTCDate } from "@/server/server-utils";

const revalidate = () => revalidatePath("/habits-tracker", "page");

export async function addHabitToTracker(habitId: string) {
  const userId = await requireAuth();

  await prisma.habitsTracker.create({
    data: {
      habitId,
      userId,
    },
  });

  revalidate();
}

export async function toggleHabitCompletionAction(
  dateKey: string,
  updates: Record<string, boolean>, // habitId -> completed
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

  await prisma.habitsTracker.deleteMany({
    where: {
      habitId,
      userId,
    },
  });

  revalidate();
}
