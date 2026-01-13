import { prisma } from "@/prisma/prisma";
import type { NotesFolderWithChildren } from "@/lib/notes-folders/types";

export async function getNotesFolders(userId: string) {
  const folders = await prisma.notesFolder.findMany({
    where: { userId },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return folders as NotesFolderWithChildren[];
}

export async function getNotesFolder(folderId: string, userId: string) {
  return await prisma.notesFolder.findFirst({
    where: { id: folderId, userId },
    include: {
      children: true,
    },
  });
}
