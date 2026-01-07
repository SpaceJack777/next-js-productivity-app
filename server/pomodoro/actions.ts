'use server';

import { getSession } from '@/lib/get-session';
import { prisma } from '@/prisma/prisma';

/**
 * Save a completed Pomodoro session
 * @param title - Title of the session
 * @param durationSeconds - Duration in seconds
 */
export async function savePomodoro(title: string, durationSeconds: number) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error('Not authenticated');

  await prisma.pomodoro.create({
    data: {
      userId: session.user.id,
      title, // required field in your schema
      duration: durationSeconds,
      completed: true,
    },
  });
}
