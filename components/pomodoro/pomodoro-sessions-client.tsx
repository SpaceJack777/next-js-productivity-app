"use client";

import { useEffect, useState } from "react";
import { FocusTimerInfo } from "./focus-timer-info";
import { getPomodoroSessions } from "@/server/pomodoro/queries";
import { Pomodoro } from "@/lib/pomodoro";
import { allSessionsRefresh } from "@/lib/pomodoro/refresh-events";

export function PomodoroSessionsClient() {
  const [sessions, setSessions] = useState<Pomodoro[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshKey = allSessionsRefresh.useRefresh();

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const freshSessions = await getPomodoroSessions();
        setSessions(freshSessions);
      } catch (error) {
        console.warn("Failed to load pomodoro sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [refreshKey]);

  return (
    <div className="h-full">
      <FocusTimerInfo sessions={sessions} loading={loading} />
    </div>
  );
}
