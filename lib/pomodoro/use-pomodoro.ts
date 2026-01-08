"use client";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { getFromStorage, saveToStorage, clearStorage } from "@/lib/storage";
import { TimerState, InternalTimerState, TimerAction } from "./types";

const STORAGE_KEY = "pomodoro-timer-state";

const timerReducer = (
  state: InternalTimerState,
  action: TimerAction,
): InternalTimerState => {
  switch (action.type) {
    case "INITIALIZE":
      return action.payload;
    case "START":
      return { ...state, isRunning: true, isFinished: false };
    case "PAUSE":
      return { ...state, isRunning: false };
    case "RESET":
      return {
        remainingMs: action.payload.durationMs,
        isRunning: false,
        isFinished: false,
      };
    case "TICK":
      return {
        ...state,
        remainingMs: action.payload.remainingMs,
        isRunning: !action.payload.isFinished,
        isFinished: action.payload.isFinished,
      };
    default:
      return state;
  }
};

// Calculate remaining time when resuming from saved state
const calculateRemainingTime = (savedState: TimerState, durationMs: number) => {
  if (savedState.isRunning && savedState.startedAt) {
    const elapsed = Date.now() - savedState.startedAt;
    const remaining = Math.max(
      (savedState.pausedAt ?? savedState.durationMs) - elapsed,
      0,
    );

    if (remaining === 0) {
      // Timer finished while away
      clearStorage(STORAGE_KEY);
      return { remainingMs: durationMs, isRunning: false, isFinished: false };
    }

    return { remainingMs: remaining, isRunning: true, isFinished: false };
  }

  // Paused state
  if (savedState.isFinished) {
    clearStorage(STORAGE_KEY);
    return { remainingMs: durationMs, isRunning: false, isFinished: false };
  }

  return {
    remainingMs: savedState.remainingMs,
    isRunning: savedState.isRunning,
    isFinished: false,
  };
};

export function usePomodoro(durationMinutes = 25) {
  const durationMs = durationMinutes * 60 * 1000;

  const startedAtRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [timerState, dispatch] = useReducer(timerReducer, {
    remainingMs: durationMs,
    isRunning: false,
    isFinished: false,
  });

  // Load saved state on mount
  useLayoutEffect(() => {
    const savedState = getFromStorage<TimerState | null>(STORAGE_KEY, null);
    if (!savedState) return;

    const calculatedState = calculateRemainingTime(savedState, durationMs);
    dispatch({ type: "INITIALIZE", payload: calculatedState });

    // Restore refs
    startedAtRef.current = savedState.startedAt;
    pausedAtRef.current = savedState.pausedAt;
  }, [durationMs]);

  useEffect(() => {
    if (!timerState.isRunning || !startedAtRef.current) return;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current!;
      const remaining = Math.max(
        (pausedAtRef.current ?? durationMs) - elapsed,
        0,
      );

      dispatch({
        type: "TICK",
        payload: { remainingMs: remaining, isFinished: remaining === 0 },
      });

      saveToStorage(STORAGE_KEY, {
        remainingMs: remaining,
        isRunning: remaining > 0,
        isFinished: remaining === 0,
        startedAt: startedAtRef.current,
        pausedAt: pausedAtRef.current,
        durationMs,
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerState.isRunning]);

  const start = () => {
    const startTime = Date.now();
    startedAtRef.current = startTime;

    if (pausedAtRef.current == null) {
      pausedAtRef.current = durationMs;
    }

    dispatch({ type: "START" });

    saveToStorage(STORAGE_KEY, {
      remainingMs: timerState.remainingMs,
      isRunning: true,
      isFinished: false,
      startedAt: startTime,
      pausedAt: pausedAtRef.current,
      durationMs,
    });
  };

  const pause = () => {
    pausedAtRef.current = timerState.remainingMs;
    dispatch({ type: "PAUSE" });

    saveToStorage(STORAGE_KEY, {
      remainingMs: timerState.remainingMs,
      isRunning: false,
      isFinished: false,
      startedAt: startedAtRef.current,
      pausedAt: pausedAtRef.current,
      durationMs,
    });
  };

  const reset = () => {
    startedAtRef.current = null;
    pausedAtRef.current = null;
    dispatch({ type: "RESET", payload: { durationMs } });
    clearStorage(STORAGE_KEY);
  };

  return {
    remainingSeconds: Math.ceil(timerState.remainingMs / 1000),
    isRunning: timerState.isRunning,
    isFinished: timerState.isFinished,
    start,
    pause,
    reset,
  };
}
