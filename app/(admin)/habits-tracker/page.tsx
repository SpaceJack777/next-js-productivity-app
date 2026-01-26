import { HabitsTracker } from "@/components/habits-tracker/habits-tracker";
import {
  getTrackedHabits,
  getHabitCompletionsForDate,
} from "@/server/habits-tracker/queries";

export default async function HabitsTrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  const selectedDate = date ?? new Date().toISOString().split("T")[0];

  const [trackedHabits, completions] = await Promise.all([
    getTrackedHabits(),
    getHabitCompletionsForDate(selectedDate),
  ]);

  const completionMap = Object.fromEntries(
    completions.map((c) => [c.habitId, c.completed]),
  );

  return (
    <HabitsTracker
      trackedHabits={trackedHabits}
      completionMap={completionMap}
      selectedDate={selectedDate}
    />
  );
}
