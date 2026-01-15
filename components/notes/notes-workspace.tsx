"use client";

import { useState } from "react";
import NotesFolderList from "@/components/notes/notes-folder-list";
import NotesList from "@/components/notes/notes-list";
import type { NotesFolderWithChildren } from "@/lib/notes-folders/types";
import type { NoteWithFolder } from "@/lib/notes/types";
import NoteEditor from "./note-editor";

type NotesWorkspaceProps = {
  folders: NotesFolderWithChildren[];
  notes: NoteWithFolder[];
};

export default function NotesWorkspace({
  folders,
  notes,
}: NotesWorkspaceProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string>();
  const [selectedNoteId, setSelectedNoteId] = useState<string>();

  const filteredNotes = selectedFolderId
    ? notes.filter((note) => note.folderId === selectedFolderId)
    : [];

  const selectedNote = selectedNoteId
    ? notes.find((note) => note.id === selectedNoteId) || null
    : null;

  const findSelectedFolder = (
    folders: NotesFolderWithChildren[],
    folderId: string,
  ): NotesFolderWithChildren | null => {
    for (const folder of folders) {
      if (folder.id === folderId) {
        return folder;
      }
      if (folder.children) {
        const found = findSelectedFolder(folder.children, folderId);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedFolder = selectedFolderId
    ? findSelectedFolder(folders, selectedFolderId)
    : null;

  return (
    <div className="flex gap-4">
      <NotesFolderList
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={setSelectedFolderId}
      />
      <NotesList
        notes={filteredNotes}
        selectedFolderId={selectedFolderId}
        selectedFolder={selectedFolder}
        selectedNoteId={selectedNoteId}
        onNoteSelect={setSelectedNoteId}
      />
      <NoteEditor note={selectedNote} />
    </div>
  );
}
