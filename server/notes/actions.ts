"use server";

import { prisma } from "@/prisma/prisma";
import { getSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";
import {
  createNoteSchema,
  updateNoteSchema,
  deleteNoteSchema,
  type CreateNoteInput,
  type UpdateNoteInput,
  type DeleteNoteInput,
} from "@/lib/validation/notes";

export async function createNote(input: CreateNoteInput) {
  const validated = createNoteSchema.parse(input);

  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const folder = await prisma.notesFolder.findFirst({
    where: { id: validated.folderId, userId: session.user.id },
  });

  if (!folder) {
    throw new Error("Folder not found");
  }

  const note = await prisma.note.create({
    data: {
      title: validated.title,
      content: validated.content,
      folderId: validated.folderId,
      userId: session.user.id,
    },
  });

  revalidatePath("/notes");
  return note;
}

export async function updateNote(input: UpdateNoteInput) {
  const validated = updateNoteSchema.parse(input);

  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const note = await prisma.note.findFirst({
    where: { id: validated.id, userId: session.user.id },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  if (validated.folderId && validated.folderId !== note.folderId) {
    const folder = await prisma.notesFolder.findFirst({
      where: { id: validated.folderId, userId: session.user.id },
    });

    if (!folder) {
      throw new Error("Folder not found");
    }
  }

  const updated = await prisma.note.update({
    where: { id: validated.id },
    data: {
      title: validated.title,
      content: validated.content,
      ...(validated.folderId && { folderId: validated.folderId }),
    },
  });

  revalidatePath("/notes");
  return updated;
}

export async function deleteNote(noteId: DeleteNoteInput) {
  const validated = deleteNoteSchema.parse(noteId);

  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const note = await prisma.note.findFirst({
    where: { id: validated, userId: session.user.id },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  await prisma.note.delete({
    where: { id: validated },
  });

  revalidatePath("/notes");
  return { success: true };
}
