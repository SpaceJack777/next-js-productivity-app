"use client";

import { useOptimistic, useTransition, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HabitsTracker } from "./habits-tracker";
import { HabitsTrackerActionClient } from "./habits-tracker-action-client";
import {
  toggleHabitCompletionAction,
  removeHabitFromTracker,
  addHabitToTracker,
} from "@/server/habits-tracker/actions";
import type { CompletionUpdate, TrackedHabit, Habit } from "./types";
import { PageHeader } from "../page-header";

type OptimisticHabitUpdate =
  | { type: "add"; habitId: string }
  | { type: "remove"; habitId: string };

type HabitsTrackerContainerProps = {
  habits: Habit[];
  initialTrackedHabits: TrackedHabit[];
  completionsByDate: Record<string, Record<string, boolean>>;
  selectedDate: string;
  days: Array<{ key: string; dayName: string; dayNumber: number }>; // Changed from string to number
};

export function HabitsTrackerContainer({
  habits,
  initialTrackedHabits,
  completionsByDate,
  selectedDate,
  days,
}: HabitsTrackerContainerProps) {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const [activeDate, setActiveDate] = useState(selectedDate);
  const [pendingHabits, setPendingHabits] = useState<Set<string>>(new Set());

  const [optimisticHabits, setOptimisticHabits] = useOptimistic(
    initialTrackedHabits,
    (state, update: OptimisticHabitUpdate) => {
      if (update.type === "add") {
        const habitToAdd = habits.find((h) => h.id === update.habitId);
        if (habitToAdd) {
          return [
            ...state,
            {
              id: `temp-${update.habitId}`,
              habitId: update.habitId,
              habit: habitToAdd,
              createdAt: new Date(),
            },
          ];
        }
      } else {
        // remove
        return state.filter((h) => h.habit.id !== update.habitId);
      }
      return state;
    },
  );

  const optimisticTrackedIds = useMemo(
    () => optimisticHabits.map((h) => h.habit.id),
    [optimisticHabits],
  );

  const [optimisticCompletions, setOptimisticCompletions] = useOptimistic(
    completionsByDate,
    (state, update: CompletionUpdate) => ({
      ...state,
      [update.date]: {
        ...state[update.date],
        [update.habitId]: update.completed,
      },
    }),
  );

  const handleToggleHabit = (habitId: string, isTracked: boolean) => {
    setPendingHabits((prev) => new Set(prev).add(habitId));

    startTransition(async () => {
      setOptimisticHabits({
        type: isTracked ? "remove" : "add",
        habitId,
      });

      try {
        if (isTracked) {
          await removeHabitFromTracker(habitId);
        } else {
          await addHabitToTracker(habitId);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setPendingHabits((prev) => {
          const next = new Set(prev);
          next.delete(habitId);
          return next;
        });
      }
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    startTransition(async () => {
      setOptimisticHabits({ type: "remove", habitId });

      try {
        await removeHabitFromTracker(habitId);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleToggleCompletion = (
    habitId: string,
    date: string,
    completed: boolean,
  ) => {
    startTransition(async () => {
      setOptimisticCompletions({ date, habitId, completed });

      try {
        await toggleHabitCompletionAction(date, { [habitId]: completed });
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleSelectDate = (dateKey: string) => {
    setActiveDate(dateKey);
    router.replace(`${pathname}?date=${dateKey}`, { scroll: false });
  };

  return (
    <>
      <PageHeader
        action={
          <HabitsTrackerActionClient
            habits={habits}
            trackedHabitIds={optimisticTrackedIds}
            onToggleHabitAction={handleToggleHabit}
            pendingHabits={pendingHabits}
          />
        }
      />

      <HabitsTracker
        trackedHabits={optimisticHabits}
        completionsByDate={optimisticCompletions}
        selectedDate={selectedDate}
        days={days}
        activeDate={activeDate}
        onSelectDateAction={handleSelectDate}
        onDeleteHabitAction={handleDeleteHabit}
        onToggleCompletionAction={handleToggleCompletion}
      />
    </>
  );
}
