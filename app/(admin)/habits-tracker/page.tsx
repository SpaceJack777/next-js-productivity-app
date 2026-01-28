import { HabitsTracker } from "@/components/habits-tracker/habits-tracker";
import { HabitsTrackerActionClient } from "@/components/habits-tracker/habits-tracker-action-client";
import {
  getTrackedHabitsWithIds,
  getHabitCompletionsForDate,
} from "@/server/habits-tracker/queries";
import { getActiveHabits } from "@/server/habits/queries";
import { getDayKeys } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";

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

  // Fetch all data in parallel
  const [habits, trackedData, allCompletions] = await Promise.all([
    getActiveHabits(),
    getTrackedHabitsWithIds(),
    Promise.all(dayKeys.map((key) => getHabitCompletionsForDate(key))),
  ]);

  const { trackedHabits, trackedHabitIds } = trackedData;

  // Build completions map
  const completionsByDate = Object.fromEntries(
    dayKeys.map((key, index) => [
      key,
      Object.fromEntries(
        allCompletions[index].map((c) => [c.habitId, c.completed]),
      ),
    ]),
  );

  return (
    <>
      <PageHeader
        action={
          <HabitsTrackerActionClient
            habits={habits}
            trackedHabits={trackedHabits}
            trackedHabitIds={trackedHabitIds}
          />
        }
      />

      <HabitsTracker
        trackedHabits={trackedHabits}
        completionsByDate={completionsByDate}
        selectedDate={selectedDate}
        days={days}
      />
    </>
  );
}
