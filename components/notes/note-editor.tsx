"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { NoteWithFolder } from "@/lib/notes/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Check, Save } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { updateNote } from "@/server/notes/actions";
import dynamic from "next/dynamic";

const Tiptap = dynamic(() => import("../tiptap/Tiptap"), {
  ssr: false,
});

type NoteEditorProps = {
  note: NoteWithFolder | null;
  isLoadingUrlParams?: boolean;
};

export default function NoteEditor({
  note,
  isLoadingUrlParams = false,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveNote = useCallback(async () => {
    if (!note) return;

    setIsSaving(true);
    setHasUnsavedChanges(false);

    try {
      await updateNote({
        id: note.id,
        title,
        content,
      });
    } catch (error) {
      console.error("Failed to save note:", error);
      setHasUnsavedChanges(true);
    } finally {
      setIsSaving(false);
    }
  }, [note, title, content]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      setHasUnsavedChanges(true);
    },
    [],
  );

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  }, []);

  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        saveNote();
      }, 5000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasUnsavedChanges, saveNote]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content ?? "");
      setHasUnsavedChanges(false);
    }
  }, [note]);

  if (isLoadingUrlParams) {
    return (
      <Card className="flex-1 md:h-full">
        <div className="flex items-center justify-center h-full">
          <Spinner className="text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!note) {
    return (
      <Card className="flex flex-1">
        <CardContent className="mt-8">
          <EmptyState
            title="No note selected"
            description="Select a note from the list to start editing"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="flex-1 text-2xl font-semibold leading-none tracking-tight bg-transparent border-none outline-none focus:outline-none"
          placeholder="Untitled"
        />
        <div className="flex items-center gap-2">
          {isSaving ? (
            <Spinner className="text-muted-foreground" />
          ) : hasUnsavedChanges ? (
            <Button
              size="sm"
              variant="outline"
              onClick={saveNote}
              className="gap-1.5"
            >
              <Save className="size-3.5" />
            </Button>
          ) : (
            <Check className="size-4" />
          )}
        </div>
      </CardHeader>
      <Tiptap content={content} onChange={handleContentChange} />
    </Card>
  );
}
