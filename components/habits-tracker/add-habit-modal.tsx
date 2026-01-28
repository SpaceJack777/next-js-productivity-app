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
import { Plus, X } from "lucide-react";
import { useOptimistic, useTransition, useState } from "react";
import type { AddHabitModalProps } from "./types";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

type OptimisticAction = {
  habitId: string;
  action: "add" | "remove";
};

export function AddHabitModal({
  habits,
  trackedHabitIds,
  open,
  action,
}: AddHabitModalProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingHabits, setPendingHabits] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Optimistic state - updates instantly before server responds
  const [optimisticTrackedIds, setOptimisticTrackedIds] = useOptimistic(
    trackedHabitIds,
    (state: string[], update: OptimisticAction) => {
      if (update.action === "add") {
        return [...state, update.habitId];
      }
      return state.filter((id) => id !== update.habitId);
    },
  );

  const handleToggleHabit = (habitId: string, isTracked: boolean) => {
    // Mark this specific habit as pending
    setPendingHabits((prev) => new Set(prev).add(habitId));

    // 1. Update UI instantly (optimistic)
    setOptimisticTrackedIds({
      habitId,
      action: isTracked ? "remove" : "add",
    });

    // 2. Sync with server in background
    startTransition(async () => {
      try {
        if (isTracked) {
          await removeHabitFromTracker(habitId);
          showToast.success("Habit removed from tracker");
        } else {
          await addHabitToTracker(habitId);
          showToast.success("Habit added to tracker");
        }
        // 3. Refresh to sync server state (happens in background)
        router.refresh();
      } catch (error) {
        // 4. On error, optimistic state auto-reverts
        showToast.error("Failed to update habit. Please try again." + error);
      } finally {
        // Remove from pending set
        setPendingHabits((prev) => {
          const next = new Set(prev);
          next.delete(habitId);
          return next;
        });
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
              // Use optimistic state instead of server state
              const isTracked = optimisticTrackedIds.includes(habit.id);
              const isThisHabitPending = pendingHabits.has(habit.id);

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
                      disabled={isThisHabitPending}
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
