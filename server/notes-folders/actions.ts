"use server";

import { prisma } from "@/prisma/prisma";
import { getSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";
import {
  createNotesFolderSchema,
  updateNotesFolderSchema,
  deleteNotesFolderSchema,
  type CreateNotesFolderInput,
  type UpdateNotesFolderInput,
  type DeleteNotesFolderInput,
} from "@/lib/validation/notes-folders";

const revalidate = () => revalidatePath("/notes");

export async function createNotesFolder(input: CreateNotesFolderInput) {
  const validated = createNotesFolderSchema.parse(input);

  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const maxOrder = await prisma.notesFolder.findFirst({
    where: { userId: session.user.id, parentId: validated.parentId || null },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const folder = await prisma.notesFolder.create({
    data: {
      name: validated.name,
      icon: validated.icon,
      parentId: validated.parentId,
      userId: session.user.id,
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  revalidate();
  return folder;
}

export async function updateNotesFolder(input: UpdateNotesFolderInput) {
  const validated = updateNotesFolderSchema.parse(input);

  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const folder = await prisma.notesFolder.findFirst({
    where: { id: validated.id, userId: session.user.id },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  const updated = await prisma.notesFolder.update({
    where: { id: validated.id },
    data: {
      name: validated.name,
      icon: validated.icon,
      parentId: validated.parentId,
      order: validated.order,
    },
  });

  revalidate();
  return updated;
}

export async function deleteNotesFolder(folderId: DeleteNotesFolderInput) {
  const validated = deleteNotesFolderSchema.parse(folderId);

  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const folder = await prisma.notesFolder.findFirst({
    where: { id: validated, userId: session.user.id },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  await prisma.notesFolder.delete({
    where: { id: validated },
  });

  revalidate();
  return { success: true };
}
