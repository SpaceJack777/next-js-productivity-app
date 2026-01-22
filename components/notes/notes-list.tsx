"use client";

import { useState } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty-state";
import { Spinner } from "../ui/spinner";
import { PlusIcon, Folder, FileX, FolderOpen } from "lucide-react";
import { createNote } from "@/server/notes/actions";
import type { NoteWithFolder } from "@/lib/validation/notes";
import type { NotesFolderWithChildren } from "@/lib/validation/notes-folders";
import * as LucideIcons from "lucide-react";

type NotesListProps = {
  notes: NoteWithFolder[];
  selectedFolderId?: string;
  selectedFolder?: NotesFolderWithChildren | null;
  selectedNoteId?: string;
  onNoteSelect: (noteId: string) => void;
  isLoadingUrlParams?: boolean;
};

export default function NotesList({
  notes,
  selectedFolderId,
  selectedFolder,
  selectedNoteId,
  onNoteSelect,
  isLoadingUrlParams = false,
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

  if (isLoadingUrlParams) {
    return (
      <Card className="w-full max-w-[300px] md:h-full">
        <div className="flex items-center justify-center h-full">
          <Spinner className="text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[300px] md:h-full flex flex-col">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Notes</CardTitle>
        {selectedFolder && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FolderIconComponent className="size-4" />
            <span>{selectedFolder.name}</span>
          </div>
        )}
      </CardHeader>
      {selectedFolderId && (
        <CardContent>
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
        </CardContent>
      )}

      <CardContent>
        {!selectedFolderId ? (
          <EmptyState
            title="No folder selected"
            description="Select a folder to view its notes"
            icon={FolderOpen}
          />
        ) : notes.length === 0 ? (
          <EmptyState
            title="No notes yet"
            description="Create your first note to get started"
            icon={FileX}
          />
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors ${
                  selectedNoteId === note.id ? "bg-accent" : ""
                }`}
                onClick={() => onNoteSelect(note.id)}
              >
                <h3 className="font-medium">{note.title || "*Untitled*"}</h3>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
