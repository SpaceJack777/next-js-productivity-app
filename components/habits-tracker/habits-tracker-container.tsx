"use client";

import {
  useOptimistic,
  useTransition,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  toggleHabitCompletionAction,
  removeHabitFromTracker,
  addHabitToTracker,
} from "@/server/habits-tracker/actions";
import type {
  OptimisticHabitUpdate,
  HabitsTrackerContainerProps,
} from "./types";
import { useRouter, usePathname } from "next/navigation";
import { HabitsTracker } from "./habits-tracker";
import { HabitsTrackerActionClient } from "./habits-tracker-action-client";
import { PageHeader } from "../page-header";
import { showToast } from "@/lib/toast";

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
  const [trackedHabits, setTrackedHabits] = useState(initialTrackedHabits);

  const pendingCompletionsRef = useRef<Record<string, Record<string, boolean>>>(
    {},
  );
  const completionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pendingHabitsRef = useRef<Record<string, boolean>>({});
  const habitsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [optimisticHabits, setOptimisticHabits] = useOptimistic(
    trackedHabits,
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
    startTransition(() => {
      setOptimisticHabits({
        type: isTracked ? "remove" : "add",
        habitId,
      });

      if (isTracked) {
        setTrackedHabits((prev) => prev.filter((h) => h.habit.id !== habitId));
      } else {
        const habitToAdd = habits.find((h) => h.id === habitId);
        if (habitToAdd) {
          setTrackedHabits((prev) => [
            ...prev,
            {
              id: `temp-${habitId}`,
              habitId,
              habit: habitToAdd,
              createdAt: new Date(),
            },
          ]);
        }
      }

      pendingHabitsRef.current[habitId] = isTracked;

      if (habitsTimeoutRef.current) clearTimeout(habitsTimeoutRef.current);

      habitsTimeoutRef.current = setTimeout(async () => {
        const updates = { ...pendingHabitsRef.current };
        pendingHabitsRef.current = {};

        try {
          await Promise.all(
            Object.entries(updates).map(([id, wasTracked]) =>
              wasTracked ? removeHabitFromTracker(id) : addHabitToTracker(id),
            ),
          );
        } catch (error) {
          console.error(error);
        }
      }, 500);
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    startTransition(async () => {
      setOptimisticHabits({ type: "remove", habitId });
      setTrackedHabits((prev) => prev.filter((h) => h.habit.id !== habitId));

      setCompletions((prev) => {
        const updated: typeof prev = {};

        for (const dateKey of Object.keys(prev)) {
          const dayCompletions = { ...prev[dateKey] };
          delete dayCompletions[habitId];
          updated[dateKey] = dayCompletions;
        }

        return updated;
      });

      try {
        await removeHabitFromTracker(habitId);
        showToast.success("Habit deleted from tracker");
      } catch (error) {
        console.error(error);
        showToast.error("Failed to delete habit from tracker: " + error);
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

    if (!pendingCompletionsRef.current[date]) {
      pendingCompletionsRef.current[date] = {};
    }
    pendingCompletionsRef.current[date][habitId] = completed;

    if (completionsTimeoutRef.current)
      clearTimeout(completionsTimeoutRef.current);

    completionsTimeoutRef.current = setTimeout(async () => {
      const updates = pendingCompletionsRef.current[date];
      delete pendingCompletionsRef.current[date];
      try {
        await toggleHabitCompletionAction(date, updates);
      } catch (error) {
        console.error(error);
        showToast.error("Failed to toggle habit completion: " + error);
      }
    }, 500);
  };

  const handleSelectDate = (dateKey: string) => {
    if (completionsTimeoutRef.current)
      clearTimeout(completionsTimeoutRef.current);

    const updates = pendingCompletionsRef.current[activeDate];
    if (updates) {
      setCompletions((prev) => ({
        ...prev,
        [activeDate]: { ...prev[activeDate], ...updates },
      }));
      delete pendingCompletionsRef.current[activeDate];
      toggleHabitCompletionAction(activeDate, updates).catch(console.error);
    }

    setActiveDate(dateKey);
    router.replace(`${pathname}?date=${dateKey}`, { scroll: false });
  };

  useEffect(() => {
    return () => {
      if (completionsTimeoutRef.current)
        clearTimeout(completionsTimeoutRef.current);
      if (habitsTimeoutRef.current) clearTimeout(habitsTimeoutRef.current);
    };
  }, []);

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
