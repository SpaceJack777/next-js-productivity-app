import type { NotesFolder } from "@prisma/client";

export type NotesFolderWithChildren = NotesFolder & {
  children: NotesFolderWithChildren[];
  _count?: {
    notes: number;
  };
};

export type CreateNotesFolderInput = {
  name: string;
  icon: string;
  parentId?: string;
};

export type UpdateNotesFolderInput = {
  id: string;
  name?: string;
  icon?: string;
  parentId?: string;
  order?: number;
};
