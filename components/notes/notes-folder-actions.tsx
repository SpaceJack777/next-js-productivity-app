import { AppActions } from "../app-actions";
import { FolderPlus as SubFolderIcon, Pencil, Trash2 } from "lucide-react";
import type { NotesFolderWithChildren } from "@/lib/validation/notes-folders";

type NotesFolderActionsProps = {
  folder: NotesFolderWithChildren;
  onCreateSubfolder: (folderId: string) => void;
  onEdit: (folder: NotesFolderWithChildren) => void;
  onDelete: (folder: NotesFolderWithChildren) => void;
};

export function NotesFolderActions({
  folder,
  onCreateSubfolder,
  onEdit,
  onDelete,
}: NotesFolderActionsProps) {
  const options = [
    {
      icon: SubFolderIcon,
      label: "New Subfolder",
      onClick: () => onCreateSubfolder(folder.id),
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: () => onEdit(folder),
    },
    {
      separator: true,
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: () => onDelete(folder),
      variant: "destructive" as const,
    },
  ];

  return <AppActions options={options} />;
}
