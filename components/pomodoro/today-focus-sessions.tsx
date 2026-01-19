"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { getTodayPomodoroSessions } from "@/server/pomodoro/queries";
import { type Pomodoro } from "@/lib/pomodoro";
import { PomodoroChart } from "./pomodoro-chart";
import { formatDuration } from "@/lib/utils";
import { TodayFocusSessionsSkeleton } from "./skeletons/today-focus-sessions-skeleton";

export function TodayFocusSessions() {
  const [sessions, setSessions] = useState<Pomodoro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const todaySessions = await getTodayPomodoroSessions();
        setSessions(todaySessions);
      } catch (error) {
        console.warn("Failed to load today's sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const totalMinutes = sessions.reduce(
    (acc, session) => acc + Math.round(session.duration / 60),
    0,
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Today&apos;s Focus Sessions</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          {loading ? (
            <TodayFocusSessionsSkeleton />
          ) : sessions.length === 0 ? (
            <p>No sessions completed today</p>
          ) : (
            <div className="space-y-2 mb-6">
              <div className="flex gap-4">
                <div>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <p className="text-muted-foreground text-sm">
                    {sessions.length === 1 ? "session" : "sessions"}
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {formatDuration(totalMinutes)}
                  </div>
                  <p className="text-muted-foreground text-sm">total time</p>
                </div>
              </div>
            </div>
          )}
          {!loading && <PomodoroChart sessions={sessions} />}
        </CardContent>
      </Card>
    </div>
  );
}
