"use server";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/prisma/prisma";
import { savePomodoroSchema } from "@/lib/validation/pomodoro";

/**
 * Save a Pomodoro session (only if duration >= 5 minutes)
 * @param title - Title of the session
 * @param durationSeconds - Duration in seconds
 */
export async function savePomodoro(title: string, durationSeconds: number) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Not authenticated");

  if (durationSeconds < 5 * 60) {
    return;
  }

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
