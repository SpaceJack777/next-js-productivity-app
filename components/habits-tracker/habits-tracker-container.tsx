"use client";

import { useTransition, useState, useMemo, useRef, useOptimistic } from "react";
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
  const [trackedHabits, setTrackedHabits] = useState(initialTrackedHabits);
  const [completions, setCompletions] = useState(completionsByDate);

  const pendingUpdatesRef = useRef<Record<string, Record<string, boolean>>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [optimisticTrackedHabits, removeOptimisticHabit] = useOptimistic(
    trackedHabits,
    (state: TrackedHabit[], habitIdToRemove: string) => {
      return state.filter((h) => h.habit.id !== habitIdToRemove);
    },
  );

  const trackedHabitIds = useMemo(
    () => trackedHabits.map((h) => h.habit.id),
    [trackedHabits],
  );

  const handleToggleHabit = (habitId: string, isTracked: boolean) => {
    startTransition(async () => {
      const habitToAdd = habits.find((h) => h.id === habitId);

      setTrackedHabits((prev) =>
        isTracked
          ? prev.filter((h) => h.habit.id !== habitId)
          : habitToAdd
            ? [
                ...prev,
                {
                  id: `temp-${habitId}`,
                  habitId,
                  habit: habitToAdd,
                  createdAt: new Date(),
                },
              ]
            : prev,
      );

      try {
        await (isTracked
          ? removeHabitFromTracker(habitId)
          : addHabitToTracker(habitId));
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleDeleteHabit = async (habitId: string) => {
    startTransition(async () => {
      removeOptimisticHabit(habitId);
      try {
        await removeHabitFromTracker(habitId);

        setTrackedHabits((prev) => prev.filter((h) => h.habit.id !== habitId));

        setCompletions((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((date) => {
            delete updated[date][habitId];
          });
          return updated;
        });
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
            trackedHabitIds={trackedHabitIds}
            onToggleHabitAction={handleToggleHabit}
          />
        }
      />

      <HabitsTracker
        trackedHabits={optimisticTrackedHabits}
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
