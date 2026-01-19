"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FocusTimerStatsSkeleton } from "./skeletons/focus-timer-stats-skeleton";
import { FocusTimerInfoProps } from "@/lib/pomodoro";
import { useMemo } from "react";

export function FocusTimerInfo({ sessions, loading }: FocusTimerInfoProps) {
  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalDurationMinutes =
      sessions.reduce((sum, session) => sum + session.duration, 0) / 60;
    const totalDurationHours = Math.floor(totalDurationMinutes / 60);
    const remainingMinutes = Math.floor(totalDurationMinutes % 60);

    return {
      totalSessions,
      totalDurationHours,
      totalDurationMinutes: remainingMinutes,
      totalDurationDisplay:
        totalDurationHours > 0
          ? `${totalDurationHours}h ${remainingMinutes}m`
          : `${Math.round(totalDurationMinutes)}m`,
    };
  }, [sessions]);

  if (loading) {
    return (
      <Card className="w-full flex flex-col h-full">
        <CardHeader>
          <CardTitle>Lifetime Focus Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <FocusTimerStatsSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader>
        <CardTitle>Lifetime Focus Statistics</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Focus Sessions
              </p>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Focus Time
              </p>
              <p className="text-2xl font-bold">{stats.totalDurationDisplay}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Session Duration
              </p>
              <p className="text-2xl font-bold">
                {stats.totalSessions > 0
                  ? `${Math.round((stats.totalDurationHours * 60 + stats.totalDurationMinutes) / stats.totalSessions)}m`
                  : "0m"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
