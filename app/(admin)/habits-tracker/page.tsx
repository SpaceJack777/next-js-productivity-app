import { HabitsTrackerContainer } from "@/components/habits-tracker/habits-tracker-container";
import {
  getTrackedHabitsWithIds,
  getHabitCompletionsForDateRange,
} from "@/server/habits-tracker/queries";
import { getActiveHabits } from "@/server/habits/queries";
import { getDayKeys } from "@/lib/utils";

type HabitsTrackerPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function HabitsTrackerPage({
  searchParams,
}: HabitsTrackerPageProps) {
  const { date } = await searchParams;

  const today = new Date();
  const days = getDayKeys(today);

  const dayKeys = days.map((d) => d.key);
  const todayKey = today.toISOString().split("T")[0];
  const selectedDate = date ?? todayKey;

  const startKey = dayKeys[0];
  const endKey = dayKeys[dayKeys.length - 1];

  const [habits, trackedData, completions] = await Promise.all([
    getActiveHabits(),
    getTrackedHabitsWithIds(),
    getHabitCompletionsForDateRange(startKey, endKey),
  ]);

  const { trackedHabits } = trackedData;

  const completionsByDate: Record<string, Record<string, boolean>> = {};
  for (const key of dayKeys) completionsByDate[key] = {};

  for (const c of completions) {
    const key = c.date.toISOString().slice(0, 10);
    if (!completionsByDate[key]) completionsByDate[key] = {};
    completionsByDate[key][c.habitId] = c.completed;
  }

  return (
    <HabitsTrackerContainer
      habits={habits}
      initialTrackedHabits={trackedHabits}
      completionsByDate={completionsByDate}
      selectedDate={selectedDate}
      days={days}
    />
  );
}
