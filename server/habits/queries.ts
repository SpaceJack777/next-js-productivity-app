"use server";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/prisma/prisma";

export async function getHabits() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.habit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}
