"use client";

import { ActionDialog } from "@/components/action-dialog";
import { showToast } from "@/lib/toast";
import { removeHabitFromTracker } from "@/server/habits-tracker/actions";

type HabitsTrackerDeleteDialogProps = {
  habitId: string;
  habitName: string;
  open: boolean;
  onOpenChangeAction: () => void;
  setLoadingHabitIdAction: (habitId: string) => void;
};

export function HabitsTrackerDeleteDialog({
  habitId,
  habitName,
  open,
  onOpenChangeAction,
  setLoadingHabitIdAction,
}: HabitsTrackerDeleteDialogProps) {
  const handleDeleteAction = async () => {
    try {
      setLoadingHabitIdAction(habitId);
      await removeHabitFromTracker(habitId);
      showToast.success(`"${habitName}" was removed successfully!`);
      onOpenChangeAction();
    } catch (error) {
      showToast.error("Failed to remove habit from tracker: " + error);
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChangeAction={onOpenChangeAction}
      onConfirmAction={() => handleDeleteAction()}
      title="Remove Habit from Tracker"
      description={`Are you sure you want to remove "${habitName}"? This action will remove all progress for this habit.`}
      confirm="Remove"
      variant="destructive"
    />
  );
}
