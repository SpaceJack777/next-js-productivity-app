"use client";

import { FocusTimerInfo } from "./focus-timer-info";
import { usePomodoroData } from "@/contexts/pomodoro-context";

export function PomodoroSessionsClient() {
  const { allSessions: sessions, loading } = usePomodoroData();

  return (
    <div className="h-full">
      <FocusTimerInfo sessions={sessions} loading={loading} />
    </div>
  );
}
