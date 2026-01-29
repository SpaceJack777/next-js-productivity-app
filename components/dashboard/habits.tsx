import {
  getHabitCompletionsForDate,
  getTrackedHabitsWithIds,
} from "@/server/habits-tracker/queries";
import { getSession } from "@/lib/get-session";
import { DashboardStatCard } from "./dashboard-stat-card";

export async function RecentHabits() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);
  const completions = await getHabitCompletionsForDate(today);
  const { trackedHabits } = await getTrackedHabitsWithIds();

  const completedCount = completions.filter((c) => c.completed).length;
  const totalHabits = trackedHabits.length;
  const progressPercent =
    totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  const stats = [
    {
      label: "Today's Habits Completed",
      value: `${completedCount} / ${totalHabits}`,
    },
    {
      label: "Today's Progress",
      value: `${progressPercent}%`,
    },
  ];

  return (
    <DashboardStatCard
      title="Todays Habits Tracked"
      viewAllHref="/habits-tracker"
      viewAllLabel="View all habits"
      stats={stats}
    />
  );
}
