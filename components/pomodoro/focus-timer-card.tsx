'use client';

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

import { useEffect, useRef, useTransition } from 'react';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type Props = {
  saveAction: (title: string, durationSeconds: number) => Promise<void>;
};

export function FocusTimerCard({ saveAction }: Props) {
  const timer = usePomodoro(1);
  const [isPending, startTransition] = useTransition();
  const hasSavedRef = useRef(false);
  const router = useRouter();

  const totalSeconds = 1 * 60;
  const elapsedSeconds = totalSeconds - timer.remainingSeconds;
  const progress = Math.min(elapsedSeconds / totalSeconds, 1);

  useEffect(() => {
    if (timer.isFinished && !hasSavedRef.current) {
      hasSavedRef.current = true;
      startTransition(() => {
        saveAction('Focus Session', 1 * 60).then(() => {
          // Refresh the page to show updated session list
          router.refresh();
        });
      });
    } else if (!timer.isRunning && !timer.isFinished) {
      // Reset hasSaved when timer is reset (not running and not finished)
      hasSavedRef.current = false;
    }
  }, [timer.isFinished, timer.isRunning, saveAction, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Focus Session</CardTitle>
        <CardDescription>Stay focused for 25 minutes</CardDescription>
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
