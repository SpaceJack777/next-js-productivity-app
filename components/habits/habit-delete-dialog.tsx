"use client";

import { ActionDialog } from "@/components/action-dialog";
import { deleteHabit } from "@/server/habits/actions";
import { showToast } from "@/lib/toast";

type HabitDeleteDialogProps = {
  habitId: string;
  habitName: string;
  open: boolean;
  onOpenChangeAction: () => void;
};

export function HabitDeleteDialog({
  habitId,
  habitName,
  open,
  onOpenChangeAction,
}: HabitDeleteDialogProps) {
  async function handleDeleteAction() {
    try {
      await deleteHabit(habitId);
      showToast.success(`"${habitName}" deleted successfully!`);
      onOpenChangeAction();
    } catch (error) {
      showToast.error("Failed to delete habit: " + error);
    }
  }

  return (
    <ActionDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
      onConfirmAction={handleDeleteAction}
      title="Delete Habit"
      description={`Are you sure you want to delete "${habitName}"? This action cannot be undone.`}
      confirm="Delete"
      variant="destructive"
    />
  );
}
