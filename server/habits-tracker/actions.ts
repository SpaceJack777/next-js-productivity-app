"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma/prisma";
import { requireAuth } from "@/server/server-utils";

export async function addHabitToTracker(habitId: string) {
  const userId = await requireAuth();

  await prisma.habitsTracker.create({
    data: {
      habitId,
      userId,
    },
  });

  revalidatePath("/habits-tracker");
}

export async function removeHabitFromTracker(habitId: string) {
  const userId = await requireAuth();

  await prisma.habitsTracker.deleteMany({
    where: {
      habitId,
      userId,
    },
  });

  revalidatePath("/habits-tracker");
}
