// server/pomodoro/queries.ts
'use server';

import { getSession } from '@/lib/get-session';
import { prisma } from '@/prisma/prisma';

export async function getPomodoroSessions() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error('Not authenticated');

  return prisma.pomodoro.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
}
