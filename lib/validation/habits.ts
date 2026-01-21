import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1).max(200),
  status: z.string(),
  description: z.string(),
});

export const updateHabitSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  status: z.string(),
  description: z.string().min(1).max(500),
});

export const deleteHabitSchema = z.string().min(1);

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type DeleteHabitInput = z.infer<typeof deleteHabitSchema>;
