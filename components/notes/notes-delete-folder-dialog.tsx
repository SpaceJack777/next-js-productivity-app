"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "../ui/button";
import { deleteNotesFolder } from "@/server/notes-folders/actions";
import type { NotesFolderWithChildren } from "@/lib/validation/notes-folders";

type NotesDeleteFolderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: NotesFolderWithChildren | null;
};

export function NotesDeleteFolderDialog({
  open,
  onOpenChange,
  folder,
}: NotesDeleteFolderDialogProps) {
  const handleDelete = async () => {
    if (!folder) return;

    try {
      await deleteNotesFolder(folder.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete folder:", error);
      alert("Failed to delete folder");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Folder</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{folder?.name}&quot;
            {folder?.children &&
              folder.children.length > 0 &&
              " and all its subfolders"}
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
