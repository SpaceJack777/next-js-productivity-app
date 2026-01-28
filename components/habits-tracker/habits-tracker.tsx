"use client";

import {
  toggleHabitCompletionAction,
  removeHabitFromTracker,
} from "@/server/habits-tracker/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { habitIconMap } from "@/components/habits/habit-icon-selector";
import { EmptyState } from "../ui/empty-state";
import { HabitsTrackerActions } from "./habits-tracker-actions";
import { useState, useTransition, useOptimistic } from "react";
import { AnimatedList, AnimatedListItem } from "../ui/animated-list";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { HabitsTrackerProps, CompletionUpdate } from "./types";
import { CircularProgress } from "../ui/circular-progress";
import { HabitsTrackerDeleteDialog } from "./habits-tracker-delete-dialog";

export function HabitsTracker({
  trackedHabits,
  completionsByDate,
  selectedDate,
  days,
}: HabitsTrackerProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeDate, setActiveDate] = useState(selectedDate);

  const router = useRouter();
  const pathname = usePathname();

  const [optimisticCompletions, setOptimisticCompletions] = useOptimistic(
    completionsByDate, // initial state

    (state, update: CompletionUpdate) => ({
      ...state,
      [update.date]: {
        ...state[update.date],
        [update.habitId]: update.completed,
      },
    }),
  );

  const getProgress = (dateKey: string) => {
    const completions = optimisticCompletions[dateKey] || {};
    const completedCount = Object.values(completions).filter(Boolean).length;
    return trackedHabits.length > 0 ? completedCount / trackedHabits.length : 0;
  };

  const completionMap = optimisticCompletions[activeDate] || {};

  const handleToggleCompletion = (
    habitId: string,
    date: string,
    completed: boolean,
  ) => {
    startTransition(async () => {
      setOptimisticCompletions({ date, habitId, completed });

      try {
        await toggleHabitCompletionAction(date, { [habitId]: completed });
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleSelectDate = (dateKey: string) => {
    setActiveDate(dateKey);
    router.replace(`${pathname}?date=${dateKey}`, { scroll: false });
  };

  const handleDeleteHabit = (habitId: string) => {
    setDeletingHabitId(habitId);

    startTransition(async () => {
      try {
        await removeHabitFromTracker(habitId);
        router.refresh();
        setDeleteDialogOpen(null);
      } catch (error) {
        console.error(error);
      } finally {
        setDeletingHabitId(null);
      }
    });
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
                onClick={() => handleSelectDate(date.key)}
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
              const isDeleting = deletingHabitId === trackedHabit.habit.id;
              const isCompleted = completionMap[trackedHabit.habit.id] ?? false;

              return (
                <AnimatedListItem
                  key={trackedHabit.id}
                  itemKey={trackedHabit.id}
                >
                  <div
                    className={cn(
                      "flex items-center gap-4 px-4 py-2 rounded-lg bg-accent/50 transition-colors",
                      isDeleting && "opacity-50 pointer-events-none",
                    )}
                  >
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
                      disabled={isDeleting}
                      onCheckedChange={(checked) =>
                        handleToggleCompletion(
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
                      isPending={isPending}
                    />
                    <HabitsTrackerDeleteDialog
                      habitName={trackedHabit.habit.name}
                      open={deleteDialogOpen === trackedHabit.habit.id}
                      onOpenChangeAction={(open) =>
                        setDeleteDialogOpen(open ? trackedHabit.habit.id : null)
                      }
                      onConfirmAction={() =>
                        handleDeleteHabit(trackedHabit.habit.id)
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
