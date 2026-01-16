"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createNotesFolder,
  updateNotesFolder,
} from "@/server/notes-folders/actions";
import type { NotesFolder } from "@prisma/client";
import { Folder, FolderHeart, FolderCode, FolderLock } from "lucide-react";
import { cn } from "@/lib/utils";

const FOLDER_ICONS = [
  { icon: Folder, name: "Folder" },
  { icon: FolderHeart, name: "FolderHeart" },
  { icon: FolderCode, name: "FolderCode" },
  { icon: FolderLock, name: "FolderLock" },
];

type NotesFolderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder?: NotesFolder;
  parentId?: string;
};

export function NotesFolderDialog({
  open,
  onOpenChange,
  folder,
  parentId,
}: NotesFolderDialogProps) {
  const [name, setName] = useState(folder?.name || "");
  const [selectedIcon, setSelectedIcon] = useState(folder?.icon || "Folder");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(folder?.name || "");
      setSelectedIcon(folder?.icon || "Folder");
    }
  }, [open, folder]);

  useEffect(() => {
    if (open) {
      setName(folder?.name || "");
      setSelectedIcon(folder?.icon || "Folder");
    }
  }, [open, folder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (folder) {
        await updateNotesFolder({
          id: folder.id,
          name,
          icon: selectedIcon,
        });
      } else {
        await createNotesFolder({
          name,
          icon: selectedIcon,
          parentId,
        });
      }
      onOpenChange(false);
      setName("");
      setSelectedIcon("Folder");
    } catch (error) {
      console.error("Failed to save folder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {folder ? "Edit Folder" : "Create New Folder"}
          </DialogTitle>
          <DialogDescription>
            {folder
              ? "Update the folder name and icon"
              : "Create a new folder to organize your notes"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Work, Personal, Ideas"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label>Folder Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {FOLDER_ICONS.map(({ icon: Icon, name: iconName }) => (
                  <Button
                    key={iconName}
                    type="button"
                    variant={selectedIcon === iconName ? "default" : "outline"}
                    className={cn(
                      "h-16 w-full flex flex-col items-center justify-center gap-1",
                    )}
                    onClick={() => setSelectedIcon(iconName)}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs">
                      {iconName.replace("Folder", "")}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Saving..." : folder ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
