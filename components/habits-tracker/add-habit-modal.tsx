"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import {
  addHabitToTracker,
  removeHabitFromTracker,
} from "@/server/habits-tracker/actions";

import { Button } from "@/components/ui/button";
import { habitIconMap } from "@/components/habits/habit-icon-selector";
import { EmptyState } from "../ui/empty-state";
import { Plus, X, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import type { AddHabitModalProps } from "./types";
import { useRouter } from "next/navigation";

export function AddHabitModal({
  habits,
  trackedHabitIds,
  open,
  action,
}: AddHabitModalProps) {
  const [isPending, startTransition] = useTransition();
  const [loadingHabitId, setLoadingHabitId] = useState<string | null>(null);
  const router = useRouter();

  const handleToggleHabit = (habitId: string, isTracked: boolean) => {
    setLoadingHabitId(habitId);
    startTransition(async () => {
      try {
        if (isTracked) {
          await removeHabitFromTracker(habitId);
        } else {
          await addHabitToTracker(habitId);
        }
        router.refresh();
      } finally {
        setLoadingHabitId(null);
      }
    });
  };

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
              const isLoading = loadingHabitId === habit.id && isPending;

              return (
                <div key={habit.id}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
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
                      onClick={() => handleToggleHabit(habit.id, isTracked)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : isTracked ? (
                        <X className="size-3.5" />
                      ) : (
                        <Plus className="size-3.5" />
                      )}
                      {isTracked ? "Remove habit" : "Add habit"}
                    </Button>
                  </div>
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
