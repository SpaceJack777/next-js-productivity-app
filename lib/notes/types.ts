import type { Note } from "@prisma/client";

export type NoteWithFolder = Note & {
  folder: {
    id: string;
    name: string;
  };
};

export type CreateNoteInput = {
  title: string;
  content: string;
  folderId: string;
};

export type UpdateNoteInput = {
  id: string;
  title: string;
  content: string;
  folderId?: string;
};
