"use client";

import { ActionDialog } from "@/components/action-dialog";
import { deleteHabit } from "@/server/habits/actions";

type HabitDeleteDialogProps = {
  habitId: string;
  habitName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HabitDeleteDialog({
  habitId,
  habitName,
  open,
  onOpenChange,
}: HabitDeleteDialogProps) {
  async function handleDelete() {
    await deleteHabit(habitId);
  }

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleDelete}
      title="Delete Habit"
      description={`Are you sure you want to delete "${habitName}"? This action cannot be undone.`}
      confirm="Delete"
      variant="destructive"
    />
  );
}
