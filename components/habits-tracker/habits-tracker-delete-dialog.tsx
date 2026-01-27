"use client";

import { ActionDialog } from "@/components/action-dialog";

type HabitsTrackerDeleteDialogProps = {
  habitId: string;
  habitName: string;
  open: boolean;
  onOpenChangeAction: () => void;
  onConfirm: () => void | Promise<void>;
};

export function HabitsTrackerDeleteDialog({
  habitName,
  open,
  onOpenChangeAction,
  onConfirm,
}: HabitsTrackerDeleteDialogProps) {
  return (
    <ActionDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
      onConfirmAction={onConfirm}
      title="Remove Habit from Tracker"
      description={`Are you sure you want to remove "${habitName}"? This action will remove all progress for this habit.`}
      confirm="Remove"
      variant="destructive"
    />
  );
}
