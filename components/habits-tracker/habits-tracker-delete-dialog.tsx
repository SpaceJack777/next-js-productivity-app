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
      title="Remove Habit from Tracker"
      description={`Are you sure you want to remove "${habitName}"? This action will remove all progress for this habit.`}
      confirm="Remove"
      variant="destructive"
    />
  );
}
