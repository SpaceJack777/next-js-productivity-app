"use client";

import { ActionDialog } from "@/components/action-dialog";

type HabitsTrackerDeleteDialogProps = {
  habitName: string;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onConfirmAction: () => void | Promise<void>;
};

export function HabitsTrackerDeleteDialog({
  habitName,
  open,
  onOpenChangeAction,
  onConfirmAction,
}: HabitsTrackerDeleteDialogProps) {
  return (
    <ActionDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
      onConfirmAction={onConfirmAction}
      title="Delete Habit from Tracker"
      description={`Are you sure you want to delete "${habitName}"? This action will delete all progress for this habit.`}
      confirm="Delete"
      variant="destructive"
    />
  );
}
