import { z } from "zod";
import type { Note } from "@prisma/client";

export const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  folderId: z.string().min(1),
});

export const updateNoteSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string(),
  folderId: z.string().min(1).optional(),
});

export const deleteNoteSchema = z.string().min(1);

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;

export type NoteWithFolder = Note & {
  folder: {
    id: string;
    name: string;
  };
};
