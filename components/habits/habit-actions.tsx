import type { Habit } from "@prisma/client";
import { AppActions } from "../app-actions";
import { CircleCheck, CircleMinus, Trash2, Pencil } from "lucide-react";

type HabitActionsProps = {
  deleteAction: () => void;
  isPending: boolean;
  toggleStatus: () => void;
  habit: Habit;
};

export function HabitActions({
  deleteAction,
  isPending,
  toggleStatus,
  habit,
}: HabitActionsProps) {
  const options = [
    {
      icon: Pencil,
      label: "Edit",
      href: `/habits/${habit.id}/edit`,
      disabled: isPending,
    },
    {
      icon: habit.status === "active" ? CircleMinus : CircleCheck,
      label: habit.status === "active" ? "Deactivate" : "Activate",
      onClick: () => toggleStatus(),
      disabled: isPending,
    },
    {
      separator: true,
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: deleteAction,
      disabled: isPending,
      variant: "destructive" as const,
    },
  ];

  return <AppActions options={options} />;
}
