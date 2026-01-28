import { HabitsTrackerActionClient } from "@/components/habits-tracker/habits-tracker-action-client";
import { getActiveHabits } from "@/server/habits/queries";
import { getTrackedHabitsWithIds } from "@/server/habits-tracker/queries";

export default async function HabitsTrackerAction() {
  const [habits, trackedData] = await Promise.all([
    getActiveHabits(),
    getTrackedHabitsWithIds(),
  ]);

  return (
    <HabitsTrackerActionClient
      habits={habits}
      trackedHabits={trackedData.trackedHabits}
      trackedHabitIds={trackedData.trackedHabitIds}
    />
  );
}
