"use server";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/prisma/prisma";
import { savePomodoroSchema } from "@/lib/validation/pomodoro";

/**
 * Save a Pomodoro session
 * @param title - Title of the session
 * @param durationSeconds - Duration in seconds
 */
export async function savePomodoro(title: string, durationSeconds: number) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const validatedData = savePomodoroSchema.parse({
    title,
    durationSeconds,
  });

  await prisma.pomodoro.create({
    data: {
      userId: session.user.id,
      title: validatedData.title,
      duration: validatedData.durationSeconds,
    },
  });
}
