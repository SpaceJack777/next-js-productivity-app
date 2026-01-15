"use client";

import { useState } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusIcon, Folder } from "lucide-react";
import { createNote } from "@/server/notes/actions";
import type { NoteWithFolder } from "@/lib/notes/types";
import type { NotesFolderWithChildren } from "@/lib/notes-folders/types";
import * as LucideIcons from "lucide-react";

type NotesListProps = {
  notes: NoteWithFolder[];
  selectedFolderId?: string;
  selectedFolder?: NotesFolderWithChildren | null;
};

export default function NotesList({
  notes,
  selectedFolderId,
  selectedFolder,
}: NotesListProps) {
  const [noteTitle, setNoteTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = async () => {
    if (!noteTitle.trim() || !selectedFolderId) return;

    setIsCreating(true);
    try {
      await createNote({
        title: noteTitle,
        content: "",
        folderId: selectedFolderId,
      });
      setNoteTitle("");
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateNote();
    }
  };

  const FolderIconComponent =
    (selectedFolder &&
      (LucideIcons as unknown as Record<string, React.ComponentType>)[
        selectedFolder.icon
      ]) ||
    Folder;

  return (
    <Card className="w-full max-w-[300px]">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Notes</CardTitle>
        {selectedFolder && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FolderIconComponent className="size-4" />
            <span>{selectedFolder.name}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {selectedFolderId && (
          <div className="flex gap-2 items-center w-full">
            <Input
              placeholder="Create note"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isCreating}
            />
            <Button
              size="icon"
              className="max-w-xs"
              variant="outline"
              onClick={handleCreateNote}
              disabled={!noteTitle.trim() || isCreating}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>

      <CardContent>
        {!selectedFolderId ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            Select a folder to view notes
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            No notes in this folder. Create one to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <h3 className="font-medium">{note.title}</h3>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
