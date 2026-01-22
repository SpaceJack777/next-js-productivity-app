"use server";

import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "../server-utils";
import { redirect } from "next/navigation";

import {
  createHabitSchema,
  updateHabitSchema,
  deleteHabitSchema,
  type DeleteHabitInput,
  type HabitIcon,
  type HabitStatus,
} from "@/lib/validation/habits";

export async function createHabitAction(formData: FormData) {
  const name = formData.get("name") as string;
  const status = formData.get("status") as HabitStatus;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as HabitIcon;

  const validated = createHabitSchema.parse({
    name,
    description,
    status,
    icon,
  });

  const userId = await requireAuth();

  await prisma.habit.create({
    data: {
      name: validated.name,
      status: validated.status,
      description: validated.description,
      icon: validated.icon,
      userId: userId,
    },
  });

  revalidatePath("/habits");
  redirect("/habits");
}

export async function updateHabitAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const status = formData.get("status") as HabitStatus;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as HabitIcon;

  const validated = updateHabitSchema.parse({
    id,
    name,
    description,
    status,
    icon,
  });

  const userId = await requireAuth();

  const habit = await prisma.habit.findFirst({
    where: { id: validated.id, userId },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  await prisma.habit.update({
    where: { id: validated.id },
    data: {
      name: validated.name,
      status: validated.status,
      description: validated.description,
      icon: validated.icon,
      userId: userId,
    },
  });

  revalidatePath("/habits");
  redirect("/habits");
}

export async function deleteHabit(habitId: DeleteHabitInput) {
  const validated = deleteHabitSchema.parse(habitId);
  const userId = await requireAuth();

  const habit = await prisma.habit.findFirst({
    where: { id: validated, userId },
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
