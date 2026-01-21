"use server";

import { prisma } from "@/prisma/prisma";
import { getSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";

import {
  createHabitSchema,
  deleteHabitSchema,
  type CreateHabitInput,
  type DeleteHabitInput,
} from "@/lib/validation/habits";

export async function createHabit(input: CreateHabitInput) {
  const validated = createHabitSchema.parse(input);

  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const habit = await prisma.habit.create({
    data: {
      name: validated.name,
      status: validated.status,
      description: validated.description,
      userId: session.user.id,
    },
  });

  revalidatePath("/habits");

  return habit;
}

export async function deleteHabit(habitId: DeleteHabitInput) {
  const validated = deleteHabitSchema.parse(habitId);

  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const habit = await prisma.habit.findFirst({
    where: { id: validated, userId: session.user.id },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  await prisma.habit.delete({
    where: { id: validated },
  });

  revalidatePath("/habits");
  return { success: true };
}
