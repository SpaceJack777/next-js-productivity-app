import { HabitsTrackerContainer } from "@/components/habits-tracker/habits-tracker-container";
import {
  getTrackedHabitsWithIds,
  getHabitCompletionsForDate,
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

  const [habits, trackedData, allCompletions] = await Promise.all([
    getActiveHabits(),
    getTrackedHabitsWithIds(),
    Promise.all(dayKeys.map((key) => getHabitCompletionsForDate(key))),
  ]);

  const { trackedHabits } = trackedData;

  const completionsByDate = Object.fromEntries(
    dayKeys.map((key, index) => [
      key,
      Object.fromEntries(
        allCompletions[index].map((c) => [c.habitId, c.completed]),
      ),
    ]),
  );

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
