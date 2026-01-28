"use client";

import { AppActions } from "../app-actions";
import { Trash2 } from "lucide-react";
import type { HabitsTrackerActionsProps } from "./types";

export function HabitsTrackerActions({
  onDeleteAction,
}: HabitsTrackerActionsProps) {
  const options = [
    {
      icon: Trash2,
      label: "Remove",
      onClick: () => onDeleteAction(),
      variant: "destructive" as const,
    },
  ];

  return <AppActions options={options} />;
}
