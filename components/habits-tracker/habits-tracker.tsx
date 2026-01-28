"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { habitIconMap } from "@/components/habits/habit-icon-selector";
import { EmptyState } from "../ui/empty-state";
import { HabitsTrackerActions } from "./habits-tracker-actions";
import { useState } from "react";
import { AnimatedList, AnimatedListItem } from "../ui/animated-list";
import { cn } from "@/lib/utils";
import type { HabitsTrackerProps } from "./types";
import { CircularProgress } from "../ui/circular-progress";
import { HabitsTrackerDeleteDialog } from "./habits-tracker-delete-dialog";

export function HabitsTracker({
  trackedHabits,
  completionsByDate,
  days,
  activeDate,
  onSelectDateAction,
  onDeleteHabitAction,
  onToggleCompletionAction,
}: HabitsTrackerProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  const getProgress = (dateKey: string) => {
    const completions = completionsByDate[dateKey] || {};
    const completedCount = Object.values(completions).filter(Boolean).length;
    return trackedHabits.length > 0 ? completedCount / trackedHabits.length : 0;
  };

  const completionMap = completionsByDate[activeDate] || {};

  const handleConfirmDelete = (habitId: string) => {
    onDeleteHabitAction(habitId);
    setDeleteDialogOpen(null);
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-6 pb-4">
          {days.map((date) => {
            const isActive = activeDate === date.key;

            return (
              <button
                key={date.key}
                type="button"
                onClick={() => onSelectDateAction(date.key)}
                aria-current={isActive ? "date" : undefined}
                className={cn(
                  "relative px-4 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-accent cursor-default"
                    : "hover:bg-accent cursor-pointer",
                )}
              >
                <span className="text-sm text-muted-foreground text-center">
                  {date.dayName}
                </span>
                <div className="text-center font-medium">{date.dayNumber}</div>

                <CircularProgress
                  progress={getProgress(date.key)}
                  size={24}
                  className="size-4 mt-1 mb-1 mx-auto"
                  circleColor="text-blue-500"
                />
              </button>
            );
          })}
        </div>

        {trackedHabits.length > 0 ? (
          <AnimatedList>
            {trackedHabits.map((trackedHabit) => {
              const Icon = habitIconMap[trackedHabit.habit.icon];
              const isCompleted = completionMap[trackedHabit.habit.id] ?? false;

              return (
                <AnimatedListItem
                  key={trackedHabit.habit.id}
                  itemKey={trackedHabit.habit.id}
                >
                  <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-accent/50 transition-colors">
                    <div className="p-2 rounded-lg bg-background">
                      {Icon && <Icon className="size-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{trackedHabit.habit.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {trackedHabit.habit.description}
                      </p>
                    </div>

                    <Checkbox
                      size="lg"
                      checked={isCompleted}
                      onCheckedChange={(checked) =>
                        onToggleCompletionAction(
                          trackedHabit.habit.id,
                          activeDate,
                          Boolean(checked),
                        )
                      }
                    />

                    <HabitsTrackerActions
                      onDeleteAction={() =>
                        setDeleteDialogOpen(trackedHabit.habit.id)
                      }
                    />
                    <HabitsTrackerDeleteDialog
                      habitName={trackedHabit.habit.name}
                      open={deleteDialogOpen === trackedHabit.habit.id}
                      onOpenChangeAction={(open) =>
                        setDeleteDialogOpen(open ? trackedHabit.habit.id : null)
                      }
                      onConfirmAction={() =>
                        handleConfirmDelete(trackedHabit.habit.id)
                      }
                    />
                  </div>
                </AnimatedListItem>
              );
            })}
          </AnimatedList>
        ) : (
          <EmptyState
            title="No tracked habits found"
            description="Add a habit to get started"
          />
        )}
      </CardContent>
    </Card>
  );
}
