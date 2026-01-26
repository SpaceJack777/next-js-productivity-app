"use client";

import type { Habit, HabitsTracker } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { habitIconMap } from "@/components/habits/habit-icon-selector";
import { EmptyState } from "../ui/empty-state";
import { HabitsTrackerActions } from "./habits-tracker-actions";
import { useState, useTransition } from "react";
import { removeHabitFromTracker } from "@/server/habits-tracker/actions";
import { Spinner } from "../ui/spinner";
import { AnimatedList, AnimatedListItem } from "../ui/animated-list";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toggleHabitCompletionAction } from "@/server/habits-tracker/actions";

type TrackedHabit = HabitsTracker & { habit: Habit };

type HabitsTrackerProps = {
  trackedHabits: TrackedHabit[];
  completionMap: Record<string, boolean>;
  selectedDate: string;
};

export function HabitsTracker({
  trackedHabits,
  completionMap,
  selectedDate,
}: HabitsTrackerProps) {
  const [isPending, startTransition] = useTransition();
  const [loadingHabitId, setLoadingHabitId] = useState<string | null>(null);
  const pathname = usePathname();
  const [optimisticDate, setOptimisticDate] = useState(selectedDate);

  const handleRemoveTrackedHabitAction = (habitId: string) => {
    setLoadingHabitId(habitId);
    startTransition(async () => {
      await removeHabitFromTracker(habitId);
    });
  };

  const handleToggleHabitCompletionAction = (
    habitId: string,
    date: string,
    completed: boolean,
  ) => {
    startTransition(async () => {
      await toggleHabitCompletionAction(habitId, date, completed);
    });
  };

  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (4 - i));
    return date;
  });

  const formatDate = (date: Date, isToday: boolean) => {
    if (isToday) return "Today";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-6 pb-4">
            {dates.map((date, index) => {
              const isToday = index === 4;
              const dateKey = date.toISOString().split("T")[0];

              return (
                <Link
                  key={dateKey}
                  href={`${pathname}?date=${dateKey}`}
                  scroll={false}
                  onClick={() => setOptimisticDate(dateKey)}
                  className={cn(
                    "px-4 py-2 rounded-lg hover:bg-accent transition-colors",
                    optimisticDate === dateKey && "bg-accent",
                  )}
                >
                  {formatDate(date, isToday)}
                </Link>
              );
            })}
          </div>

          {trackedHabits.length > 0 ? (
            <AnimatedList>
              {trackedHabits.map((trackedHabit) => {
                const Icon = habitIconMap[trackedHabit.habit.icon];
                const isLoading = loadingHabitId === trackedHabit.habit.id;

                return (
                  <AnimatedListItem
                    key={trackedHabit.id}
                    itemKey={trackedHabit.id}
                  >
                    <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-accent/50 transition-colors">
                      <div className="p-2 rounded-lg bg-background">
                        {Icon && <Icon className="size-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {trackedHabit.habit.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {trackedHabit.habit.description}
                        </p>
                      </div>
                      {isLoading ? (
                        <Spinner className="size-6" />
                      ) : (
                        <Checkbox
                          size="lg"
                          checked={
                            completionMap[trackedHabit.habit.id] ?? false
                          }
                          disabled={isLoading}
                          onClick={() =>
                            handleToggleHabitCompletionAction(
                              trackedHabit.habit.id,
                              selectedDate,
                              !(completionMap[trackedHabit.habit.id] ?? false),
                            )
                          }
                        />
                      )}
                      <HabitsTrackerActions
                        trackedHabit={trackedHabit}
                        onRemoveTrackedHabitAction={
                          handleRemoveTrackedHabitAction
                        }
                        isPending={isPending}
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
    </>
  );
}
