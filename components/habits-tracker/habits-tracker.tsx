"use client";

import type { Habit, HabitsTracker } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { habitIconMap } from "@/components/habits/habit-icon-selector";
import { EmptyState } from "../ui/empty-state";

type TrackedHabit = HabitsTracker & { habit: Habit };

type HabitsTrackerProps = {
  trackedHabits: TrackedHabit[];
};

export function HabitsTracker({ trackedHabits }: HabitsTrackerProps) {
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
              return (
                <button
                  key={index}
                  className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  {formatDate(date, isToday)}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {trackedHabits.length > 0 ? (
              trackedHabits.map((trackedHabit) => {
                const Icon = habitIconMap[trackedHabit.habit.icon];
                return (
                  <div
                    key={trackedHabit.id}
                    className="flex items-center gap-4 px-4 py-2 rounded-lg bg-accent/50 transition-colors"
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
                    <Checkbox size="lg" />
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="No tracked habits found"
                description="Add a habit to get started"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
