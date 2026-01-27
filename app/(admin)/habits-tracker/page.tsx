import { HabitsTracker } from "@/components/habits-tracker/habits-tracker";
import {
  getTrackedHabits,
  getHabitCompletionsForDate,
  getProgressByDayKey,
} from "@/server/habits-tracker/queries";
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

  const trackedHabits = await getTrackedHabits();
  const totalHabits = trackedHabits.length;

  const [allCompletions, progressByDayKey] = await Promise.all([
    Promise.all(dayKeys.map((key) => getHabitCompletionsForDate(key))),
    getProgressByDayKey(dayKeys, totalHabits),
  ]);

  const completionsByDate = Object.fromEntries(
    dayKeys.map((key, index) => [
      key,
      Object.fromEntries(
        allCompletions[index].map((c) => [c.habitId, c.completed]),
      ),
    ]),
  );

  return (
    <HabitsTracker
      trackedHabits={trackedHabits}
      completionsByDate={completionsByDate}
      selectedDate={selectedDate}
      progressByDayKey={progressByDayKey}
      days={days}
    />
  );
}
