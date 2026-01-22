import { z } from "zod";

export const timerSettingsSchema = z.object({
  focusSession: z.number().min(5).max(180),
  shortBreak: z.number().min(1).max(30),
  longBreak: z.number().min(5).max(60),
});

export const savePomodoroSchema = z.object({
  title: z.string().min(1).max(100),
  durationSeconds: z.number().positive("Duration must be positive"),
});

export type TimerSettings = z.infer<typeof timerSettingsSchema>;
export type SavePomodoroInput = z.infer<typeof savePomodoroSchema>;
