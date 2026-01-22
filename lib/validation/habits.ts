import { z } from "zod";

export const habitIconSchema = z.enum([
  "Target",
  "Flame",
  "Dumbbell",
  "BookOpen",
  "Coffee",
  "Moon",
  "Heart",
  "Zap",
  "Trophy",
  "Star",
]);

export const habitStatusSchema = z.enum(["active", "inactive"]);

export const createHabitSchema = z.object({
  name: z.string().min(1).max(200),
  status: habitStatusSchema.default("active"),
  description: z.string(),
  icon: habitIconSchema.default("Target"),
});

export const updateHabitSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  status: habitStatusSchema,
  description: z.string().min(1).max(500),
  icon: habitIconSchema.default("Target"),
});

export const deleteHabitSchema = z.string().min(1);

export type HabitIcon = z.infer<typeof habitIconSchema>;
export type HabitStatus = z.infer<typeof habitStatusSchema>;
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type DeleteHabitInput = z.infer<typeof deleteHabitSchema>;
