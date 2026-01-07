"use client";

import { EndSessionDialog } from "@/components/pomodoro/end-session-dialog";
import { TimerSettingsDialog } from "@/components/pomodoro/timer-settings-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { usePomodoro } from "@/lib/pomodoro/use-pomodoro";
import { useUserSettings } from "@/hooks/use-user-timer-settings";
import { useSessionState } from "@/hooks/use-session-state";
import { type TimerSettings } from "@/lib/validation/pomodoro";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

import React, { useEffect, useState, useMemo } from "react";

interface Timer {
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  saveAction: (title: string, durationSeconds: number) => Promise<void>;
};

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

export function FocusTimerCard({ saveAction }: Props) {
  const {
    settings: timerSettings,
    isLoading,
    updateSettings,
  } = useUserSettings();

  const {
    currentSessionDuration,
    sessionStarted,
    isPending,
    startSession,
    resetSession,
    endSessionEarly,
    handleTimerUpdate,
  } = useSessionState({ timerSettings, saveAction });

  const [showEndDialog, setShowEndDialog] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  React.useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Memoize complex render logic to prevent unnecessary recalculations
  const nextSessionIndicator = useMemo(() =>
    hasHydrated &&
    currentSessionDuration !== timerSettings.focusSession &&
    sessionStarted ? (
      <> • Next session: {timerSettings.focusSession} min</>
    ) : null,
    [hasHydrated, currentSessionDuration, timerSettings.focusSession, sessionStarted]
  );

  const handleSettingsChange = async (newSettings: TimerSettings) => {
    try {
      await updateSettings(newSettings);
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  // Memoize the timer update callback to prevent unnecessary re-renders
  const memoizedTimerUpdate = useMemo(
    () => (timer: Timer) => handleTimerUpdate(timer, currentSessionDuration),
    [handleTimerUpdate, currentSessionDuration]
  );

  return (
    <TimerWrapper
      key={`timer-${currentSessionDuration}`}
      duration={currentSessionDuration}
      onTimerUpdate={memoizedTimerUpdate}
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
            <Card className="relative">
              <div className="absolute top-4 right-4 z-10">
                <TimerSettingsDialog
                  settings={timerSettings}
                  onSettingsChange={handleSettingsChange}
                />
              </div>
              <CardHeader className="text-center">
                <CardTitle>Focus Session</CardTitle>
                <CardDescription
                  suppressHydrationWarning
                  className="text-center"
                >
                  {isLoading ? (
                    <Skeleton className="h-4 w-50 mt-1 mx-auto" />
                  ) : (
                    <>
                      Current session: {currentSessionDuration} min
                      {nextSessionIndicator}
                    </>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-between gap-8 min-h-[400px]">
                <div className="flex flex-col items-center gap-8">
                  <CircularProgress progress={progress}>
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

                  {timer.isFinished && (
                    <div className="text-center space-y-1">
                      <div className="text-4xl">🎉</div>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        Session Complete!
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Great work!
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="flex gap-3 w-full justify-center"
                  suppressHydrationWarning
                >
                  {timer.isRunning ? (
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
                        timer.reset();
                        resetSession();
                      }}
                      size="lg"
                      className="min-w-[140px]"
                    >
                      Start New Session
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
                          {sessionStarted ? "Resume" : "Start Focus"}
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
            />
          </>
        );
      }}
    />
  );
}
