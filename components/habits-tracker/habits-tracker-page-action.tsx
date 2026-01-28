import { HabitsTrackerActionClient } from "@/components/habits-tracker/habits-tracker-action-client";
import { getActiveHabits } from "@/server/habits/queries";
import { getTrackedHabitIds } from "@/server/habits-tracker/queries";

export default async function HabitsTrackerAction() {
  const [habits, trackedHabitIds] = await Promise.all([
    getActiveHabits(),
    getTrackedHabitIds(),
  ]);

  return (
    <HabitsTrackerActionClient
      habits={habits}
      trackedHabitIds={trackedHabitIds}
    />
  );
}
