"use client";

import type { Habit, HabitsTracker } from "@prisma/client";
import { AppActions } from "../app-actions";
import { Trash2 } from "lucide-react";

type HabitsTrackerActionsProps = {
  trackedHabit: HabitsTracker & { habit: Habit };
  onRemoveTrackedHabitAction: (habitId: string) => void;
  isPending: boolean;
};

export function HabitsTrackerActions({
  trackedHabit,
  onRemoveTrackedHabitAction,
  isPending,
}: HabitsTrackerActionsProps) {
  const options = [
    {
      icon: Trash2,
      label: "Remove",
      onClick: () => onRemoveTrackedHabitAction(trackedHabit.habit.id),
      disabled: isPending,
      variant: "destructive" as const,
    },
  ];

  return <AppActions options={options} />;
}
