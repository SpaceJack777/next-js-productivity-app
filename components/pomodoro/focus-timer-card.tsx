'use client';

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

import { useEffect, useRef, useState, useTransition } from 'react';

interface TimerSettings {
  focusSession: number;
  shortBreak: number;
  longBreak: number;
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

export function FocusTimerCard({ saveAction }: Props) {
  const [timerSettings, setTimerSettings] =
    useState<TimerSettings>(loadTimerSettings);
  const timer = usePomodoro(timerSettings.focusSession);
  const [isPending, startTransition] = useTransition();
  const hasSavedRef = useRef(false);
  const router = useRouter();

  const totalSeconds = timerSettings.focusSession * 60;
  const elapsedSeconds = totalSeconds - timer.remainingSeconds;
  const progress = Math.min(elapsedSeconds / totalSeconds, 1);

  const handleSettingsChange = (newSettings: TimerSettings) => {
    setTimerSettings(newSettings);
    saveTimerSettings(newSettings);
  };

  useEffect(() => {
    if (timer.isFinished && !hasSavedRef.current) {
      hasSavedRef.current = true;
      startTransition(() => {
        saveAction('Focus Session', timerSettings.focusSession * 60).then(
          () => {
            // Refresh the page to show updated session list
            router.refresh();
          }
        );
      });
    } else if (!timer.isRunning && !timer.isFinished) {
      // Reset hasSaved when timer is reset (not running and not finished)
      hasSavedRef.current = false;
    }
  }, [
    timer.isFinished,
    timer.isRunning,
    saveAction,
    router,
    timerSettings.focusSession,
  ]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Focus Session</CardTitle>
        <CardDescription>
          Stay focused for {timerSettings.focusSession} minutes
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
              <div className="text-6xl font-mono font-semibold tabular-nums">
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
              <div className="text-sm text-muted-foreground">Great work!</div>
            </div>
          )}
        </div>

        <div className="flex gap-3 w-full justify-center">
          {!timer.isRunning ? (
            <Button onClick={timer.start} size="lg" className="min-w-[140px]">
              Start Focus
            </Button>
          ) : (
            <Button
              onClick={timer.pause}
              size="lg"
              variant="secondary"
              className="min-w-[140px]"
            >
              Pause
            </Button>
          )}
          <Button
            variant="outline"
            disabled={isPending}
            onClick={timer.reset}
            size="lg"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
