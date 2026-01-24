import { HabitsTrackerActionClient } from "@/components/habits-tracker/habits-tracker-action-client";
import { getActiveHabits } from "@/server/habits/queries";
import { getTrackedHabits } from "@/server/habits-tracker/queries";

export default async function HabitsTrackerAction() {
  const [habits, trackedHabits] = await Promise.all([
    getActiveHabits(),
    getTrackedHabits(),
  ]);

  const trackedHabitIds = trackedHabits.map((th) => th.habitId);

  return (
    <HabitsTrackerActionClient
      habits={habits}
      trackedHabitIds={trackedHabitIds}
    />
  );
}
