"use client";

import { ActionDialog } from "@/components/action-dialog";
import { deleteHabit } from "@/server/habits/actions";
import { showToast } from "@/lib/toast";

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
    try {
      await deleteHabit(habitId);
      showToast.success(`"${habitName}" deleted successfully!`);
      onOpenChange(false);
    } catch (error) {
      showToast.error("Failed to delete habit");
    }
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
