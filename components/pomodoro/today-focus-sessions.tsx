"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { PomodoroChart } from "./pomodoro-chart";
import { formatDuration } from "@/lib/utils";
import { TodayFocusSessionsSkeleton } from "./skeletons/today-focus-sessions-skeleton";
import { EmptyState } from "../ui/empty-state";
import { Clock } from "lucide-react";
import { usePomodoroData } from "@/contexts/pomodoro-context";

export function TodayFocusSessions() {
  const { todaySessions: sessions, loading } = usePomodoroData();

  const totalMinutes = sessions.reduce(
    (acc, session) => acc + Math.round(session.duration / 60),
    0,
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="gap-0">
          <CardTitle>Today&apos;s Focus Sessions</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 justify-between">
          {loading ? (
            <TodayFocusSessionsSkeleton />
          ) : sessions.length === 0 ? (
            <>
              <div className="space-y-2 mb-4">
                <div className="flex">
                  <div className="text-2xl font-bold">0 sessions</div>
                </div>
              </div>
              <EmptyState
                icon={Clock}
                title="No sessions today"
                description="Start a focus session to see your progress."
              />
            </>
          ) : (
            <>
              <div className="space-y-2 mb-4">
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
              <div className="mt-auto flex-1 border p-2 pb-0 rounded-lg flex items-end min-h-0">
                <PomodoroChart sessions={sessions} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
