"use server";

import { prisma } from "@/prisma/prisma";
import { getSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";
import type { CreateNoteInput, UpdateNoteInput } from "@/lib/notes/types";

export async function createNote(input: CreateNoteInput) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const folder = await prisma.notesFolder.findFirst({
    where: { id: input.folderId, userId: session.user.id },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  const note = await prisma.note.create({
    data: {
      title: input.title,
      content: input.content,
      folderId: input.folderId,
      userId: session.user.id,
    },
  });

  revalidatePath("/notes");
  return note;
}

export async function updateNote(input: UpdateNoteInput) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const note = await prisma.note.findFirst({
    where: { id: input.id, userId: session.user.id },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  if (input.folderId && input.folderId !== note.folderId) {
    const folder = await prisma.notesFolder.findFirst({
      where: { id: input.folderId, userId: session.user.id },
    });

    if (!folder) {
      throw new Error("Folder not found");
    }
  }

  const updated = await prisma.note.update({
    where: { id: input.id },
    data: {
      title: input.title,
      content: input.content,
      ...(input.folderId && { folderId: input.folderId }),
    },
  });

  revalidatePath("/notes");
  return updated;
}

export async function deleteNote(noteId: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: session.user.id },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  await prisma.note.delete({
    where: { id: noteId },
  });

  revalidatePath("/notes");
  return { success: true };
}
