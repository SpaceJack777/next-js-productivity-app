"use server";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/prisma/prisma";
import { requireAuth } from "../server-utils";

export async function getHabits(query?: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.habit.findMany({
    where: {
      userId: session.user.id,
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getHabitById(id: string) {
  const userId = await requireAuth();

  return prisma.habit.findFirst({
    where: { id, userId },
  });
}

export async function getActiveHabits() {
  const userId = await requireAuth();

  return prisma.habit.findMany({
    where: {
      userId,
      status: "active",
    },
    select: {
      id: true,
      name: true,
      icon: true,
      description: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
