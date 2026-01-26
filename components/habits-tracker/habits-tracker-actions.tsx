"use client";

import { AppActions } from "../app-actions";
import { Trash2 } from "lucide-react";
import type { HabitsTrackerActionsProps } from "./types";

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
