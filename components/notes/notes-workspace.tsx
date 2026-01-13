"use client";

import { useState } from "react";
import NotesFolderList from "@/components/notes/notes-folder-list";
import NotesList from "@/components/notes/notes-list";
import type { NotesFolderWithChildren } from "@/lib/notes-folders/types";
import type { NoteWithFolder } from "@/lib/notes/types";

type NotesWorkspaceProps = {
  folders: NotesFolderWithChildren[];
  notes: NoteWithFolder[];
};

export default function NotesWorkspace({
  folders,
  notes,
}: NotesWorkspaceProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string>();

  const filteredNotes = selectedFolderId
    ? notes.filter((note) => note.folderId === selectedFolderId)
    : [];

  return (
    <div className="flex gap-4">
      <NotesFolderList
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={setSelectedFolderId}
      />
      <NotesList notes={filteredNotes} selectedFolderId={selectedFolderId} />
    </div>
  );
}
