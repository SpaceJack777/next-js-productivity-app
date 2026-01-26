"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma/prisma";
import { requireAuth } from "@/server/server-utils";

const revalidate = () => revalidatePath("/habits-tracker", "page");

function dayKeyToUTCDate(dayKey: string) {
  return new Date(`${dayKey}T00:00:00.000Z`);
}

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
  habitId: string,
  dataKey: string,
  completed: boolean,
) {
  const userId = await requireAuth();
  const date = dayKeyToUTCDate(dataKey);

  await prisma.habitCompletion.upsert({
    where: { habitId_userId_date: { habitId, userId, date } },
    update: { completed },
    create: { habitId, userId, date, completed },
  });

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
