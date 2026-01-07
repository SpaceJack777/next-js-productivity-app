'use client';

import { EndSessionDialog } from '@/components/pomodoro/end-session-dialog';
import { TimerSettingsDialog } from '@/components/pomodoro/timer-settings-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/circular-progress';
import { usePomodoro } from '@/lib/pomodoro/use-pomodoro';

import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

interface TimerSettings {
  focusSession: number;
  shortBreak: number;
  longBreak: number;
}

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
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const TIMER_SETTINGS_KEY = 'pomodoro-timer-settings';

const defaultSettings: TimerSettings = {
  focusSession: 25,
  shortBreak: 5,
  longBreak: 15,
};

function loadTimerSettings(): TimerSettings {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const saved = localStorage.getItem(TIMER_SETTINGS_KEY);
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveTimerSettings(settings: TimerSettings) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save timer settings:', error);
  }
}

type Props = {
  saveAction: (title: string, durationSeconds: number) => Promise<void>;
};

// Wrapper component that gets remounted when duration changes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isFinished, timer.isRunning, onTimerUpdate]);

  return <>{render(timer)}</>;
}

export function FocusTimerCard({ saveAction }: Props) {
  const [timerSettings, setTimerSettings] =
    useState<TimerSettings>(loadTimerSettings);
  const [currentSessionDuration, setCurrentSessionDuration] = useState<number>(
    timerSettings.focusSession
  );
  const [isPending, startTransition] = useTransition();
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const hasSavedRef = useRef(false);
  const router = useRouter();

  const handleSettingsChange = (newSettings: TimerSettings) => {
    setTimerSettings(newSettings);
    saveTimerSettings(newSettings);
    // Settings are saved but current session continues with its duration
    // Next session will use the new settings
  };

  const handleTimerUpdate = useCallback(
    (timer: Timer) => {
      if (timer.isFinished && !hasSavedRef.current) {
        hasSavedRef.current = true;
        startTransition(() => {
          saveAction('Focus Session', currentSessionDuration * 60).then(() => {
            // Apply new settings for next session
            setCurrentSessionDuration(timerSettings.focusSession);
            // Refresh the page to show updated session list
            router.refresh();
          });
        });
      } else if (!timer.isRunning && !timer.isFinished) {
        // Reset hasSaved when timer is reset (not running and not finished)
        hasSavedRef.current = false;
      }
    },
    [
      currentSessionDuration,
      timerSettings.focusSession,
      saveAction,
      router,
      startTransition,
    ]
  );

  return (
    <TimerWrapper
      key={`timer-${timerSettings.focusSession}`}
      duration={currentSessionDuration}
      onTimerUpdate={handleTimerUpdate}
      render={(timer) => {
        const totalSeconds = currentSessionDuration * 60;
        const elapsedSeconds = totalSeconds - timer.remainingSeconds;
        const progress = Math.min(elapsedSeconds / totalSeconds, 1);
        const elapsedMinutes = Math.ceil(elapsedSeconds / 60);

        return (
          <>
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Focus Session</CardTitle>
                <CardDescription suppressHydrationWarning>
                  Current session: {currentSessionDuration} min
                  {currentSessionDuration !== timerSettings.focusSession && (
                    <> • Next session: {timerSettings.focusSession} min</>
                  )}
                </CardDescription>
                <div className="mt-4 flex justify-center">
                  <TimerSettingsDialog
                    settings={timerSettings}
                    onSettingsChange={handleSettingsChange}
                  />
                </div>
              </CardHeader>

              <CardContent className="flex flex-col items-center justify-between gap-8 min-h-[400px]">
                <div className="flex flex-col items-center gap-8">
                  <CircularProgress progress={progress}>
                    <div className="text-center">
                      <div
                        className="text-6xl font-mono font-semibold tabular-nums"
                        suppressHydrationWarning
                      >
                        {formatTime(timer.remainingSeconds)}
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
                        {sessionStarted ? 'Resume' : 'Start Focus'}
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
                      'Focus Session (Ended Early)',
                      elapsedMinutes * 60
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
