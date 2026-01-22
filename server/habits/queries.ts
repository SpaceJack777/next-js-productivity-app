"use server";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/prisma/prisma";
import { requireAuth } from "../server-utils";

export async function getHabits() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.habit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getHabitById(id: string) {
  const userId = await requireAuth();

  return prisma.habit.findFirst({
    where: { id, userId },
  });
}
