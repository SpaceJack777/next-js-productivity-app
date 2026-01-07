'use client';
import { useEffect, useRef, useState } from 'react';

export function usePomodoro(durationMinutes = 25) {
  const durationMs = durationMinutes * 60 * 1000;

  const startedAtRef = useRef<number | null>(null); // time when timer started
  const pausedAtRef = useRef<number | null>(null); // time remaining when paused
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isRunning || !startedAtRef.current) return;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current!;
      const remaining = Math.max(
        (pausedAtRef.current ?? durationMs) - elapsed,
        0
      );

      setRemainingMs(remaining);

      if (remaining === 0) {
        clearInterval(intervalRef.current!);
        setIsRunning(false);
        setIsFinished(true);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning, durationMs]);

  const start = () => {
    // If timer was paused, resume from remaining time
    const startTime = Date.now();
    startedAtRef.current = startTime;

    if (pausedAtRef.current == null) {
      pausedAtRef.current = durationMs; // first start
    }

    setIsRunning(true);
    setIsFinished(false);
  };

  const pause = () => {
    setIsRunning(false);
    pausedAtRef.current = remainingMs; // store remaining time
  };

  const reset = () => {
    startedAtRef.current = null;
    pausedAtRef.current = null;
    setRemainingMs(durationMs);
    setIsRunning(false);
    setIsFinished(false);
  };

  return {
    remainingSeconds: Math.ceil(remainingMs / 1000),
    isRunning,
    isFinished,
    start,
    pause,
    reset,
  };
}
