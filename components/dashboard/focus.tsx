"use client";

import { usePomodoroData } from "@/contexts/pomodoro-context";
import { formatDuration } from "@/lib/utils";
import { DashboardStatCard } from "./dashboard-stat-card";

export function FocusStats() {
  const { todaySessions: sessions, loading } = usePomodoroData();

  const totalMinutes = sessions.reduce(
    (acc, session) => acc + Math.round(session.duration / 60),
    0,
  );

  const totalDuration = formatDuration(totalMinutes);

  const lastSessionDuration =
    sessions.length > 0
      ? formatDuration(Math.round(sessions[sessions.length - 1].duration / 60))
      : "0m";

  const stats = [
    {
      label: `Total Focus Time Today (${sessions.length} sessions)`,
      value: totalDuration,
    },
    {
      label: "Last Focus Session duration",
      value: lastSessionDuration,
    },
  ];

  return (
    <DashboardStatCard
      title="Todays focus"
      viewAllHref="/focus-timer"
      viewAllLabel="View all"
      stats={stats}
      loading={loading}
    />
  );
}
