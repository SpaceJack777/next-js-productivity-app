import { HabitsTracker } from "@/components/habits-tracker/habits-tracker";
import { getTrackedHabits } from "@/server/habits-tracker/queries";

export default async function HabitsTrackerPage() {
  const trackedHabits = await getTrackedHabits();

  return <HabitsTracker trackedHabits={trackedHabits} />;
}
