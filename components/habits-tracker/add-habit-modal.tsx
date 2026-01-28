"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { habitIconMap } from "@/components/habits/habit-icon-selector";
import { EmptyState } from "../ui/empty-state";
import { Plus, X } from "lucide-react";
import type { AddHabitModalProps } from "./types";

export function AddHabitModal({
  habits,
  trackedHabitIds,
  open,
  action,
  onToggleHabitAction,
  pendingHabits,
}: AddHabitModalProps) {
  const getIcon = (iconName: string) => {
    const Icon = habitIconMap[iconName];
    return Icon ? <Icon className="size-5" /> : null;
  };

  return (
    <Dialog open={open} onOpenChange={action}>
      <DialogContent className="max-h-[85vh] flex flex-col">
        <DialogTitle>Select Habits to Track</DialogTitle>
        <div className="mt-4 overflow-y-auto pr-2 space-y-2">
          {habits.length > 0 ? (
            habits.map((habit) => {
              const isTracked = trackedHabitIds.includes(habit.id);
              const isPending = pendingHabits.has(habit.id);

              return (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                    {getIcon(habit.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{habit.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {habit.description}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant={isTracked ? "outline" : "default"}
                    className="gap-1.5 shrink-0"
                    onClick={() => onToggleHabitAction(habit.id, isTracked)}
                    disabled={isPending}
                  >
                    {isTracked ? (
                      <>
                        <X className="size-3.5" />
                        Remove
                      </>
                    ) : (
                      <>
                        <Plus className="size-3.5" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="No active habits found"
              description="Create a habit first"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
