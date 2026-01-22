import { z } from "zod";
import type { NotesFolder } from "@prisma/client";

export const createNotesFolderSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().min(1),
  parentId: z.string().min(1).optional(),
});

export const updateNotesFolderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  icon: z.string().min(1).optional(),
  parentId: z.string().min(1).optional(),
  order: z.number().int().optional(),
});

export const deleteNotesFolderSchema = z.string().min(1);

export type CreateNotesFolderInput = z.infer<typeof createNotesFolderSchema>;
export type UpdateNotesFolderInput = z.infer<typeof updateNotesFolderSchema>;
export type DeleteNotesFolderInput = z.infer<typeof deleteNotesFolderSchema>;

export type NotesFolderWithChildren = NotesFolder & {
  children: NotesFolderWithChildren[];
  _count?: {
    notes: number;
  };
};
