"use client";

import type { NoteWithFolder } from "@/lib/notes/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FileEdit } from "lucide-react";
import Tiptap from "../Tiptap";

type NoteEditorProps = {
  note: NoteWithFolder | null;
};

export default function NoteEditor({ note }: NoteEditorProps) {
  if (!note) {
    return (
      <Card className="flex-1">
        <EmptyState
          title="No note selected"
          description="Select a note from the list to start editing"
          icon={FileEdit}
        />
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tiptap content={note.content} />
      </CardContent>
    </Card>
  );
}
