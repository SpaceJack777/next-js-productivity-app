"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { usePomodoro } from "@/lib/pomodoro/use-pomodoro";
import { useUserSettings } from "@/hooks/use-user-timer-settings";
import { useSessionState } from "@/hooks/use-session-state";
import {
  allSessionsRefresh,
  todaySessionsRefresh,
  totalSessionsRefresh,
} from "@/lib/pomodoro/refresh-events";
import { type TimerSettings } from "@/lib/validation/pomodoro";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { EndSessionDialog } from "@/components/pomodoro/end-session-dialog";
import { TimerSettingsDialog } from "@/components/pomodoro/timer-settings-dialog";
import { formatTime } from "@/lib/utils";
import { Timer, FocusTimerCardProps } from "@/lib/pomodoro";

import React, { useEffect, useState, useCallback } from "react";

function TimerWrapper({
  duration,
  onTimerUpdate,
  render,
}: {
  duration: number;
  onTimerUpdate: (timer: Timer) => void;
  render: (timer: Timer) => React.ReactNode;
}) {
  const timer = usePomodoro(duration);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    onTimerUpdate(timer);
  }, [timer.isFinished, timer.isRunning, onTimerUpdate]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return <>{render(timer)}</>;
}

export function FocusTimerCard({ saveAction }: FocusTimerCardProps) {
  const {
    settings: timerSettings,
    isLoading,
    updateSettings,
  } = useUserSettings();

  const memoizedSaveAction = useCallback(
    async (title: string, durationSeconds: number) => {
      const result = await saveAction(title, durationSeconds);
      allSessionsRefresh.trigger();
      todaySessionsRefresh.trigger();
      totalSessionsRefresh.trigger();
      return result;
    },
    [saveAction],
  );

  const {
    currentSessionDuration,
    sessionStarted,
    sessionType,
    isLongBreak,
    isPending,
    startSession,
    endSessionEarly,
    handleTimerUpdate,
  } = useSessionState({ timerSettings, saveAction: memoizedSaveAction });

  const [showEndDialog, setShowEndDialog] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  React.useEffect(() => {
    setHasHydrated(true);
  }, []);

  const handleSettingsChange = async (newSettings: TimerSettings) => {
    try {
      await updateSettings(newSettings);
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const handleTimerUpdateStable = useCallback(
    (timer: Timer) => handleTimerUpdate(timer, currentSessionDuration),
    [handleTimerUpdate, currentSessionDuration],
  );

  return (
    <TimerWrapper
      key={
        sessionStarted
          ? undefined
          : `timer-${currentSessionDuration}-${sessionType}`
      }
      duration={currentSessionDuration}
      onTimerUpdate={handleTimerUpdateStable}
      render={(timer) => {
        const totalSeconds = currentSessionDuration * 60;
        const elapsedSeconds = totalSeconds - timer.remainingSeconds;
        const progress = Math.min(elapsedSeconds / totalSeconds, 1);
        const elapsedMinutes = Math.ceil(elapsedSeconds / 60);

        const handleEndSessionConfirm = () => {
          endSessionEarly(timer, elapsedMinutes);
          setShowEndDialog(false);
        };

        return (
          <>
            <Card className="relative h-full">
              <div className="absolute top-4 right-4 z-10">
                <TimerSettingsDialog
                  settings={timerSettings}
                  onSettingsChange={handleSettingsChange}
                />
              </div>
              <CardHeader className="text-center">
                <CardTitle suppressHydrationWarning>
                  {sessionType === "focus"
                    ? "Focus Session"
                    : isLongBreak
                      ? "Long Break"
                      : "Short Break"}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-between gap-8 min-h-[400px]">
                <div className="flex flex-col items-center gap-8">
                  <CircularProgress
                    progress={progress}
                    circleColor={
                      sessionType === "focus"
                        ? ""
                        : isLongBreak
                          ? "text-blue-600"
                          : "text-emerald-900"
                    }
                  >
                    <div className="text-center">
                      <div
                        className="text-6xl font-mono font-semibold tabular-nums"
                        suppressHydrationWarning
                      >
                        {isLoading ? (
                          <Spinner className="size-10" />
                        ) : (
                          formatTime(timer.remainingSeconds)
                        )}
                      </div>
                    </div>
                  </CircularProgress>
                </div>

                <div
                  className="flex gap-3 w-full justify-center"
                  suppressHydrationWarning
                >
                  {isLoading ? (
                    <Skeleton className="h-10 min-w-[140px]" />
                  ) : timer.isRunning ? (
                    <Button
                      onClick={timer.pause}
                      size="lg"
                      variant="secondary"
                      className="min-w-[140px]"
                    >
                      Pause
                    </Button>
                  ) : timer.isFinished ? (
                    <Button
                      onClick={() => {
                        timer.start();
                        startSession();
                      }}
                      size="lg"
                      className="min-w-[140px]"
                      suppressHydrationWarning
                    >
                      {sessionType === "focus"
                        ? isLongBreak
                          ? "Start Long Break"
                          : "Start Short Break"
                        : "Start Focus Session"}
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          timer.start();
                          startSession();
                        }}
                        size="lg"
                        className="min-w-[140px]"
                      >
                        <span suppressHydrationWarning>
                          {sessionStarted
                            ? "Resume"
                            : sessionType === "focus"
                              ? "Start Focus"
                              : "Start Break"}
                        </span>
                      </Button>
                      {hasHydrated && sessionStarted && (
                        <Button
                          variant="outline"
                          onClick={() => setShowEndDialog(true)}
                          size="lg"
                          disabled={isPending}
                        >
                          End Session
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <EndSessionDialog
              open={showEndDialog}
              onOpenChange={setShowEndDialog}
              onConfirm={handleEndSessionConfirm}
              elapsedMinutes={elapsedMinutes}
              sessionType={sessionType}
            />
          </>
        );
      }}
    />
  );
}
