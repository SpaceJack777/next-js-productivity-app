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

  const [trackedHabits, completions] = await Promise.all([
    getTrackedHabits(),
    getHabitCompletionsForDate(selectedDate),
  ]);

  const totalHabits = trackedHabits.length;
  const progressByDayKey = await getProgressByDayKey(dayKeys, totalHabits);

  const completionMap = Object.fromEntries(
    completions.map((c) => [c.habitId, c.completed]),
  );

  return (
    <HabitsTracker
      trackedHabits={trackedHabits}
      completionMap={completionMap}
      selectedDate={selectedDate}
      progressByDayKey={progressByDayKey}
      days={days}
    />
  );
}
