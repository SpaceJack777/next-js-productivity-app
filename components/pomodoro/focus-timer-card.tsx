"use client";

import { EndSessionDialog } from "@/components/pomodoro/end-session-dialog";
import {
  TimerSettingsDialog,
  defaultTimerSettings,
} from "@/components/pomodoro/timer-settings-dialog";
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
import { type TimerSettings } from "@/lib/validation/pomodoro";
import { Spinner } from "@/components/ui/spinner";

import { useRouter } from "next/navigation";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

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

const TIMER_SETTINGS_KEY = "pomodoro-timer-settings";

function loadTimerSettings() {
  try {
    const saved = localStorage.getItem(TIMER_SETTINGS_KEY);
    return saved ? { ...JSON.parse(saved) } : defaultTimerSettings;
  } catch {
    return defaultTimerSettings;
  }
}

function saveTimerSettings(settings: typeof defaultTimerSettings) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Failed to save timer settings:", error);
  }
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

  useEffect(() => {
    onTimerUpdate(timer);
  }, [timer.isFinished, timer.isRunning, onTimerUpdate]);

  return <>{render(timer)}</>;
}

export function FocusTimerCard({ saveAction }: Props) {
  const [timerSettings, setTimerSettings] = useState(defaultTimerSettings);
  const [currentSessionDuration, setCurrentSessionDuration] =
    useState<number>(25);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const settings = loadTimerSettings();
    setTimerSettings(settings);
    setCurrentSessionDuration(settings.focusSession);
    setIsLoading(false);
  }, []);

  const [showEndDialog, setShowEndDialog] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const hasSavedRef = useRef(false);
  const router = useRouter();

  const handleSettingsChange = (newSettings: TimerSettings) => {
    setTimerSettings(newSettings);
    saveTimerSettings(newSettings);
  };

  const handleTimerUpdate = useCallback(
    (timer: Timer) => {
      if (timer.isFinished && !hasSavedRef.current) {
        hasSavedRef.current = true;
        startTransition(() => {
          saveAction("Focus Session", currentSessionDuration * 60).then(() => {
            setCurrentSessionDuration(timerSettings.focusSession);
            router.refresh();
          });
        });
      } else if (!timer.isRunning && !timer.isFinished) {
        hasSavedRef.current = false;
      }
    },
    [
      currentSessionDuration,
      timerSettings.focusSession,
      saveAction,
      router,
      startTransition,
    ],
  );

  return (
    <TimerWrapper
      key={`timer-${currentSessionDuration}`}
      duration={currentSessionDuration}
      onTimerUpdate={handleTimerUpdate}
      render={(timer) => {
        const totalSeconds = currentSessionDuration * 60;
        const elapsedSeconds = totalSeconds - timer.remainingSeconds;
        const progress = Math.min(elapsedSeconds / totalSeconds, 1);
        const elapsedMinutes = Math.ceil(elapsedSeconds / 60);

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
                <CardDescription suppressHydrationWarning>
                  Current session:{" "}
                  {isLoading ? (
                    <Spinner className="inline-flex size-2" />
                  ) : (
                    currentSessionDuration
                  )}{" "}
                  min
                  {currentSessionDuration !== timerSettings.focusSession && (
                    <> • Next session: {timerSettings.focusSession} min</>
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
                        setSessionStarted(false);
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
                          setSessionStarted(true);
                        }}
                        size="lg"
                        className="min-w-[140px]"
                      >
                        {sessionStarted ? "Resume" : "Start Focus"}
                      </Button>
                      {sessionStarted && (
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
              onConfirm={() => {
                // Only save if at least 5 minutes elapsed
                if (elapsedMinutes >= 5 && !hasSavedRef.current) {
                  hasSavedRef.current = true;
                  startTransition(() => {
                    saveAction(
                      "Focus Session (Ended Early)",
                      elapsedMinutes * 60,
                    ).then(() => {
                      timer.reset();
                      setCurrentSessionDuration(timerSettings.focusSession);
                      setShowEndDialog(false);
                      router.refresh();
                    });
                  });
                } else {
                  // Just reset without saving
                  timer.reset();
                  setCurrentSessionDuration(timerSettings.focusSession);
                  setSessionStarted(false);
                  setShowEndDialog(false);
                }
              }}
              elapsedMinutes={elapsedMinutes}
            />
          </>
        );
      }}
    />
  );
}
