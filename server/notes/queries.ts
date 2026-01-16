import { prisma } from "@/prisma/prisma";
import type { NoteWithFolder } from "@/lib/notes/types";

export async function getNotes(userId: string, folderId?: string) {
  const notes = await prisma.note.findMany({
    where: {
      userId,
      ...(folderId && { folderId }),
    },
    include: {
      folder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return notes as NoteWithFolder[];
}

export async function getNote(noteId: string, userId: string) {
  return await prisma.note.findFirst({
    where: { id: noteId, userId },
    include: {
      folder: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
