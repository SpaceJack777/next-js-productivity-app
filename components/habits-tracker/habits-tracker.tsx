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
import { useState, useTransition, useEffect, useOptimistic } from "react";
import { AnimatedList, AnimatedListItem } from "../ui/animated-list";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { HabitsTrackerProps } from "./types";
import { CircularProgress } from "../ui/circular-progress";
import { HabitsTrackerDeleteDialog } from "./habits-tracker-delete-dialog";
import { showToast } from "@/lib/toast";

type CompletionUpdate = {
  date: string;
  habitId: string;
  completed: boolean;
};

export function HabitsTracker({
  trackedHabits,
  completionsByDate: initialCompletionsByDate,
  selectedDate: initialDate,
  progressByDayKey: initialProgress,
  days,
}: HabitsTrackerProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeDate, setActiveDate] = useState(initialDate);

  const router = useRouter();
  const pathname = usePathname();

  const totalHabits = trackedHabits.length;

  const [optimisticCompletionsByDate, setOptimisticCompletions] = useOptimistic(
    initialCompletionsByDate,
    (state, update: CompletionUpdate) => ({
      ...state,
      [update.date]: {
        ...state[update.date],
        [update.habitId]: update.completed,
      },
    }),
  );

  const [optimisticProgress, setOptimisticProgress] = useOptimistic(
    initialProgress,
    (state, update: CompletionUpdate) => {
      const currentCompletion =
        initialCompletionsByDate[update.date]?.[update.habitId] || false;
      const currentProgress = state[update.date] || 0;

      let delta = 0;
      if (update.completed && !currentCompletion) {
        delta = 1 / totalHabits;
      } else if (!update.completed && currentCompletion) {
        delta = -1 / totalHabits;
      }

      return {
        ...state,
        [update.date]: Math.max(0, Math.min(1, currentProgress + delta)),
      };
    },
  );

  useEffect(() => {
    setActiveDate(initialDate);
  }, [initialDate]);

  const completionMap = optimisticCompletionsByDate[activeDate] || {};

  const handleToggleHabitCompletionAction = (
    habitId: string,
    date: string,
    completed: boolean,
  ) => {
    const update: CompletionUpdate = { date, habitId, completed };

    setOptimisticCompletions(update);
    setOptimisticProgress(update);

    startTransition(async () => {
      try {
        await toggleHabitCompletionAction(date, { [habitId]: completed });
      } catch (error) {
        showToast.error("Failed to update habit" + error);
      }
    });
  };

  const handleSelectDate = (dateKey: string) => {
    setActiveDate(dateKey);
    router.replace(`${pathname}?date=${dateKey}`, { scroll: false });
  };

  const handleDeleteHabit = (habitId: string, habitName: string) => {
    setDeletingHabitId(habitId);

    startTransition(async () => {
      try {
        await removeHabitFromTracker(habitId);
        router.refresh();
        showToast.success(`"${habitName}" was removed successfully!`);
        setDeleteDialogOpen(null);
      } catch (error) {
        showToast.error("Failed to remove habit from tracker" + error);
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
                  progress={optimisticProgress[date.key] ?? 0}
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
                      checked={completionMap[trackedHabit.habit.id] ?? false}
                      disabled={isDeleting}
                      onCheckedChange={(checked) =>
                        handleToggleHabitCompletionAction(
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
                        handleDeleteHabit(
                          trackedHabit.habit.id,
                          trackedHabit.habit.name,
                        )
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
