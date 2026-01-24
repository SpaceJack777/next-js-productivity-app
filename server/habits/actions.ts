"use server";

import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "../server-utils";

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
}

export async function toggleHabitStatusAction(habitId: string) {
  const userId = await requireAuth();

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  await prisma.habit.update({
    where: { id: habitId },
    data: {
      status: habit.status === "active" ? "inactive" : "active",
    },
  });

  revalidatePath("/habits");
  return { success: true };
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
export async function addHabitToTracker(habitId: string) {
  const userId = await requireAuth();

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingCompletion = await prisma.habitCompletion.findFirst({
    where: {
      habitId,
      userId,
    },
  });

  if (!existingCompletion) {
    await prisma.habitCompletion.create({
      data: {
        habitId,
        userId,
        date: today,
        completed: false,
      },
    });
  }

  revalidatePath("/habits-tracker");
  return { success: true };
}

export async function toggleHabitCompletion(habitId: string, date: Date) {
  const userId = await requireAuth();

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const existingCompletion = await prisma.habitCompletion.findUnique({
    where: {
      habitId_userId_date: {
        habitId,
        userId,
        date: startOfDay,
      },
    },
  });

  if (existingCompletion) {
    await prisma.habitCompletion.update({
      where: {
        habitId_userId_date: {
          habitId,
          userId,
          date: startOfDay,
        },
      },
      data: {
        completed: !existingCompletion.completed,
      },
    });
  } else {
    await prisma.habitCompletion.create({
      data: {
        habitId,
        userId,
        date: startOfDay,
        completed: true,
      },
    });
  }

  revalidatePath("/habits-tracker");
  return { success: true };
}
