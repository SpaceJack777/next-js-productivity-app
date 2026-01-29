"use client";

import { useOptimistic, useTransition, useState, useMemo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HabitsTracker } from "./habits-tracker";
import { HabitsTrackerActionClient } from "./habits-tracker-action-client";
import {
  toggleHabitCompletionAction,
  removeHabitFromTracker,
  addHabitToTracker,
} from "@/server/habits-tracker/actions";
import type { TrackedHabit, Habit } from "./types";
import { PageHeader } from "../page-header";

type OptimisticHabitUpdate =
  | { type: "add"; habitId: string }
  | { type: "remove"; habitId: string };

type HabitsTrackerContainerProps = {
  habits: Habit[];
  initialTrackedHabits: TrackedHabit[];
  completionsByDate: Record<string, Record<string, boolean>>;
  selectedDate: string;
  days: Array<{ key: string; dayName: string; dayNumber: number }>;
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
  const [completions, setCompletions] = useState(completionsByDate);

  const pendingUpdatesRef = useRef<Record<string, Record<string, boolean>>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        return state.filter((h) => h.habit.id !== update.habitId);
      }
      return state;
    },
  );

  const optimisticTrackedIds = useMemo(
    () => optimisticHabits.map((h) => h.habit.id),
    [optimisticHabits],
  );

  const handleToggleHabit = (habitId: string, isTracked: boolean) => {
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
        router.refresh();
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
    setCompletions((prev) => ({
      ...prev,
      [date]: { ...prev[date], [habitId]: completed },
    }));

    if (!pendingUpdatesRef.current[date]) {
      pendingUpdatesRef.current[date] = {};
    }
    pendingUpdatesRef.current[date][habitId] = completed;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const updates = pendingUpdatesRef.current[date];
      if (updates && Object.keys(updates).length > 0) {
        delete pendingUpdatesRef.current[date];
        try {
          await toggleHabitCompletionAction(date, updates);
        } catch (error) {
          console.error(error);
        }
      }
    }, 700);
  };

  const handleSelectDate = (dateKey: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const updates = pendingUpdatesRef.current[activeDate];
    if (updates && Object.keys(updates).length > 0) {
      setCompletions((prev) => ({
        ...prev,
        [activeDate]: { ...prev[activeDate], ...updates },
      }));
      delete pendingUpdatesRef.current[activeDate];
      toggleHabitCompletionAction(activeDate, updates).catch(console.error);
    }

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
          />
        }
      />

      <HabitsTracker
        trackedHabits={optimisticHabits}
        completionsByDate={completions}
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
