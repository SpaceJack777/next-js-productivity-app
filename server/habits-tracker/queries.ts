"use server";

import { prisma } from "@/prisma/prisma";
import { requireAuth } from "@/server/server-utils";

export async function getTrackedHabits() {
  const userId = await requireAuth();

  return prisma.habitsTracker.findMany({
    where: { userId },
    include: { habit: true },
    orderBy: { order: "asc" },
  });
}
