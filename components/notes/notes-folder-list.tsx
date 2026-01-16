"use client";

import { useState } from "react";
import {
  FolderItem,
  FolderTrigger,
  FolderContent,
  Files,
  SubFiles,
} from "@/components/animate-ui/components/radix/files";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty-state";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderPlus as SubFolderIcon,
  FolderX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotesFolderDialog } from "./notes-folder-dialog";
import { NotesDeleteFolderDialog } from "./notes-delete-folder-dialog";
import type { NotesFolderWithChildren } from "@/lib/notes-folders/types";
import * as LucideIcons from "lucide-react";

type NotesFolderListProps = {
  folders: NotesFolderWithChildren[];
  selectedFolderId?: string;
  onFolderSelect: (folderId: string) => void;
};

export default function NotesFolderList({
  folders,
  selectedFolderId,
  onFolderSelect,
}: NotesFolderListProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] =
    useState<NotesFolderWithChildren | null>(null);
  const [folderToDelete, setFolderToDelete] =
    useState<NotesFolderWithChildren | null>(null);
  const [parentIdForCreate, setParentIdForCreate] = useState<
    string | undefined
  >();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleCreateSubfolder = (parentId: string) => {
    setParentIdForCreate(parentId);
    setShowCreateDialog(true);
  };

  const handleEdit = (folder: NotesFolderWithChildren) => {
    setSelectedFolder(folder);
    setShowEditDialog(true);
  };

  const handleDelete = (folder: NotesFolderWithChildren) => {
    setFolderToDelete(folder);
    setShowDeleteDialog(true);
  };

  const getTotalNoteCount = (folder: NotesFolderWithChildren): number => {
    let total = folder._count?.notes ?? 0;
    if (folder.children) {
      for (const child of folder.children) {
        total += getTotalNoteCount(child);
      }
    }
    return total;
  };

  const renderFolder = (folder: NotesFolderWithChildren) => {
    const IconComponent =
      (LucideIcons as unknown as Record<string, React.ComponentType>)[
        folder.icon
      ] || LucideIcons.Folder;
    const hasChildren = folder.children && folder.children.length > 0;
    const noteCount = folder._count?.notes ?? 0;
    const totalNoteCount = getTotalNoteCount(folder);

    return (
      <FolderItem key={folder.id} value={folder.id}>
        <div
          className={`flex items-center justify-between w-full group ${
            selectedFolderId === folder.id
              ? "[&>div_[data-slot='folder-highlight']]:bg-accent [&>div_[data-slot='folder-highlight']]:rounded-lg"
              : ""
          }`}
        >
          <div
            className="flex-1 cursor-pointer"
            onClick={() => onFolderSelect(folder.id)}
          >
            <FolderTrigger icon={<IconComponent />} hasChildren={hasChildren}>
              <div className="flex items-center gap-2">
                <span>{folder.name}</span>
                {noteCount > 0 && (
                  <>
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {noteCount}
                    </span>
                    {hasChildren && (
                      <>
                        /{" "}
                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {totalNoteCount}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </FolderTrigger>
          </div>
          <DropdownMenu
            open={openDropdownId === folder.id}
            onOpenChange={(open) => setOpenDropdownId(open ? folder.id : null)}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 transition-opacity ${
                  selectedFolderId === folder.id || openDropdownId === folder.id
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleCreateSubfolder(folder.id)}
              >
                <SubFolderIcon className="size-4 mr-2" />
                New Subfolder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(folder)}>
                <Pencil className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(folder)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {folder.children && folder.children.length > 0 && (
          <FolderContent>
            <SubFiles>
              {folder.children.map((child) => renderFolder(child))}
            </SubFiles>
          </FolderContent>
        )}
      </FolderItem>
    );
  };

  const rootFolders = folders.filter((f) => !f.parentId);

  return (
    <>
      <Card className="max-w-[300px] w-full md:h-full relative flex flex-col">
        <CardHeader className="flex items-center justify-between gap-0">
          <CardTitle>Folders</CardTitle>
          <Button
            variant="outline"
            className="absolute top-3 right-4"
            size="xs"
            onClick={() => {
              setParentIdForCreate(undefined);
              setShowCreateDialog(true);
            }}
          >
            <Plus className="size-3.5" /> New folder
          </Button>
        </CardHeader>
        {rootFolders.length > 0 ? (
          <Files className="w-full h-full p-0 px-4">
            {rootFolders.map((folder) => renderFolder(folder))}
          </Files>
        ) : (
          <CardContent>
            <EmptyState
              title="No folders yet"
              description="Create your first folder to get started"
              icon={FolderX}
            />
          </CardContent>
        )}
      </Card>

      <NotesFolderDialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) setParentIdForCreate(undefined);
        }}
        parentId={parentIdForCreate}
      />

      <NotesFolderDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setSelectedFolder(null);
        }}
        folder={selectedFolder || undefined}
      />

      <NotesDeleteFolderDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setFolderToDelete(null);
        }}
        folder={folderToDelete}
      />
    </>
  );
}
