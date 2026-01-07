'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { usePomodoro } from '@/lib/pomodoro/use-pomodoro';

import { useEffect, useTransition } from 'react';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type Props = {
  saveAction: (title: string, durationSeconds: number) => Promise<void>;
};

export function FocusTimerCard({ saveAction }: Props) {
  const timer = usePomodoro(25);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (timer.isFinished) {
      startTransition(() => {
        saveAction('Focus Session', 25 * 60);
      });
    }
  }, [timer.isFinished, saveAction]);

  return (
    <Card className="min-h-100">
      <CardHeader className="text-center">
        <CardTitle>Focus Session</CardTitle>
        <CardDescription>Stay focused for 25 minutes</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6">
        <div className="text-6xl font-mono">
          {formatTime(timer.remainingSeconds)}
        </div>

        <div className="flex gap-3">
          {!timer.isRunning ? (
            <Button onClick={timer.start}>Start</Button>
          ) : (
            <Button onClick={timer.pause}>Pause</Button>
          )}
          <Button variant="outline" disabled={isPending} onClick={timer.reset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
