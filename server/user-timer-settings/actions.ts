"use server";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/prisma/prisma";
import {
  timerSettingsSchema,
  type TimerSettings,
} from "@/lib/validation/pomodoro";

/**
 * Get user settings, creating default settings if they don't exist
 */
export async function getUserSettings(): Promise<TimerSettings> {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Not authenticated");

  let settings = await prisma.userTimerSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    // Create default settings for new user
    settings = await prisma.userTimerSettings.create({
      data: {
        userId: session.user.id,
        focusSession: 25,
        shortBreak: 5,
        longBreak: 15,
      },
    });
  }

  return {
    focusSession: settings.focusSession,
    shortBreak: settings.shortBreak,
    longBreak: settings.longBreak,
  };
}

/**
 * Update user timer settings
 */
export async function updateUserSettings(
  settings: TimerSettings,
): Promise<void> {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const validated = timerSettingsSchema.parse(settings);

  await prisma.userTimerSettings.upsert({
    where: { userId: session.user.id },
    update: {
      focusSession: validated.focusSession,
      shortBreak: validated.shortBreak,
      longBreak: validated.longBreak,
    },
    create: {
      userId: session.user.id,
      focusSession: validated.focusSession,
      shortBreak: validated.shortBreak,
      longBreak: validated.longBreak,
    },
  });
}
