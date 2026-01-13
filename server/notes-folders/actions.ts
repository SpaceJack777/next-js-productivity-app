"use server";

import { prisma } from "@/prisma/prisma";
import { getSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";
import type {
  CreateNotesFolderInput,
  UpdateNotesFolderInput,
} from "@/lib/notes-folders/types";

export async function createNotesFolder(input: CreateNotesFolderInput) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const maxOrder = await prisma.notesFolder.findFirst({
    where: { userId: session.user.id, parentId: input.parentId || null },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const folder = await prisma.notesFolder.create({
    data: {
      name: input.name,
      icon: input.icon,
      parentId: input.parentId,
      userId: session.user.id,
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  revalidatePath("/notes");
  return folder;
}

export async function updateNotesFolder(input: UpdateNotesFolderInput) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const folder = await prisma.notesFolder.findFirst({
    where: { id: input.id, userId: session.user.id },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  const updated = await prisma.notesFolder.update({
    where: { id: input.id },
    data: {
      name: input.name,
      icon: input.icon,
      parentId: input.parentId,
      order: input.order,
    },
  });

  revalidatePath("/notes");
  return updated;
}

export async function deleteNotesFolder(folderId: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const folder = await prisma.notesFolder.findFirst({
    where: { id: folderId, userId: session.user.id },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  await prisma.notesFolder.delete({
    where: { id: folderId },
  });

  revalidatePath("/notes");
  return { success: true };
}
