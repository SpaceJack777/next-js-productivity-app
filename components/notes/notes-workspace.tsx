"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedFolderId, setSelectedFolderId] = useState<string>();
  const [selectedNoteId, setSelectedNoteId] = useState<string>();
  const [isLoadingUrlParams, setIsLoadingUrlParams] = useState(true);

  useEffect(() => {
    const folder = searchParams.get("folder");
    const note = searchParams.get("note");

    if (folder) setSelectedFolderId(folder);
    if (note) setSelectedNoteId(note);

    setIsLoadingUrlParams(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUrl = useCallback(
    (folderId?: string, noteId?: string) => {
      const params = new URLSearchParams(window.location.search);

      if (folderId) params.set("folder", folderId);
      else params.delete("folder");

      if (noteId) params.set("note", noteId);
      else params.delete("note");

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  const folderMap = useMemo(() => {
    const map = new Map<string, NotesFolderWithChildren>();
    const addToMap = (folders: NotesFolderWithChildren[]) => {
      for (const folder of folders) {
        map.set(folder.id, folder);
        if (folder.children) addToMap(folder.children);
      }
    };
    addToMap(folders);
    return map;
  }, [folders]);

  const filteredNotes = useMemo(
    () =>
      selectedFolderId
        ? notes.filter((note) => note.folderId === selectedFolderId)
        : [],
    [selectedFolderId, notes],
  );

  const selectedNote = useMemo(
    () =>
      selectedNoteId
        ? notes.find((note) => note.id === selectedNoteId) || null
        : null,
    [selectedNoteId, notes],
  );

  const selectedFolder = useMemo(
    () => (selectedFolderId ? folderMap.get(selectedFolderId) || null : null),
    [selectedFolderId, folderMap],
  );

  const handleFolderSelect = useCallback(
    (folderId: string) => {
      setSelectedFolderId(folderId);
      setSelectedNoteId(undefined);
      updateUrl(folderId, undefined);
    },
    [updateUrl],
  );

  const handleNoteSelect = useCallback(
    (noteId: string) => {
      setSelectedNoteId(noteId);
      updateUrl(selectedFolderId, noteId);
    },
    [updateUrl, selectedFolderId],
  );

  return (
    <div className="flex gap-4 h-full">
      <NotesFolderList
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={handleFolderSelect}
      />
      <NotesList
        notes={filteredNotes}
        selectedFolderId={selectedFolderId}
        selectedFolder={selectedFolder}
        selectedNoteId={selectedNoteId}
        onNoteSelect={handleNoteSelect}
        isLoadingUrlParams={isLoadingUrlParams}
      />
      <NoteEditor
        key={selectedNote?.id}
        note={selectedNote}
        isLoadingUrlParams={isLoadingUrlParams}
      />
    </div>
  );
}
