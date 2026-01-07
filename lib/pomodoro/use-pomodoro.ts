'use client';
import { useEffect, useLayoutEffect, useReducer, useRef } from 'react';

const STORAGE_KEY = 'pomodoro-timer-state';

interface TimerState {
  remainingMs: number;
  isRunning: boolean;
  isFinished: boolean;
  startedAt: number | null;
  pausedAt: number | null;
  durationMs: number;
}

interface InternalTimerState {
  remainingMs: number;
  isRunning: boolean;
  isFinished: boolean;
}

type TimerAction =
  | { type: 'INITIALIZE'; payload: InternalTimerState }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET'; payload: { durationMs: number } }
  | { type: 'TICK'; payload: { remainingMs: number; isFinished: boolean } };

const timerReducer = (
  state: InternalTimerState,
  action: TimerAction
): InternalTimerState => {
  switch (action.type) {
    case 'INITIALIZE':
      return action.payload;
    case 'START':
      return { ...state, isRunning: true, isFinished: false };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET':
      return {
        remainingMs: action.payload.durationMs,
        isRunning: false,
        isFinished: false,
      };
    case 'TICK':
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

export function usePomodoro(durationMinutes = 25) {
  const durationMs = durationMinutes * 60 * 1000;

  const startedAtRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load raw state from localStorage (without Date.now calculations)
  const loadRawState = (): TimerState | null => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as TimerState) : null;
    } catch (error) {
      console.warn('Failed to load pomodoro state:', error);
      return null;
    }
  };

  const saveState = (state: TimerState) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save pomodoro state:', error);
    }
  };

  // Start with default state, calculate elapsed time in useLayoutEffect
  const [timerState, dispatch] = useReducer(timerReducer, {
    remainingMs: durationMs,
    isRunning: false,
    isFinished: false,
  });

  // Load and calculate state synchronously before paint to avoid Date.now() during render
  useLayoutEffect(() => {
    const savedState = loadRawState();
    if (!savedState) return;

    // If timer was running, calculate elapsed time since last save
    if (savedState.isRunning && savedState.startedAt) {
      const elapsed = Date.now() - savedState.startedAt;
      const remaining = Math.max(
        (savedState.pausedAt ?? savedState.durationMs) - elapsed,
        0
      );

      dispatch({
        type: 'INITIALIZE',
        payload: {
          remainingMs: remaining,
          isRunning: remaining > 0,
          isFinished: remaining === 0,
        },
      });

      // Update refs
      startedAtRef.current = savedState.startedAt;
      pausedAtRef.current = savedState.pausedAt;

      // If timer finished while away, save finished state
      if (remaining === 0) {
        saveState({
          remainingMs: 0,
          isRunning: false,
          isFinished: true,
          startedAt: null,
          pausedAt: null,
          durationMs,
        });
      }
    } else {
      // Timer was paused or finished
      dispatch({
        type: 'INITIALIZE',
        payload: {
          remainingMs: savedState.remainingMs,
          isRunning: savedState.isRunning,
          isFinished: savedState.isFinished,
        },
      });

      // Update refs
      startedAtRef.current = savedState.startedAt;
      pausedAtRef.current = savedState.pausedAt;
    }
  }, [durationMs]);

  useEffect(() => {
    if (!timerState.isRunning || !startedAtRef.current) return;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current!;
      const remaining = Math.max(
        (pausedAtRef.current ?? durationMs) - elapsed,
        0
      );

      dispatch({
        type: 'TICK',
        payload: { remainingMs: remaining, isFinished: remaining === 0 },
      });

      if (remaining === 0) {
        clearInterval(intervalRef.current!);
        // Save finished state
        saveState({
          remainingMs: 0,
          isRunning: false,
          isFinished: true,
          startedAt: null,
          pausedAt: null,
          durationMs,
        });
      } else {
        // Save current running state
        saveState({
          remainingMs: remaining,
          isRunning: true,
          isFinished: false,
          startedAt: startedAtRef.current,
          pausedAt: pausedAtRef.current,
          durationMs,
        });
      }
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [timerState.isRunning, durationMs]);

  const start = () => {
    // If timer was paused, resume from remaining time
    const startTime = Date.now();
    startedAtRef.current = startTime;

    if (pausedAtRef.current == null) {
      pausedAtRef.current = durationMs; // first start
    }

    dispatch({ type: 'START' });

    // Save started state
    saveState({
      remainingMs: timerState.remainingMs,
      isRunning: true,
      isFinished: false,
      startedAt: startTime,
      pausedAt: pausedAtRef.current,
      durationMs,
    });
  };

  const pause = () => {
    dispatch({ type: 'PAUSE' });
    pausedAtRef.current = timerState.remainingMs; // store remaining time

    // Save paused state
    saveState({
      remainingMs: timerState.remainingMs,
      isRunning: false,
      isFinished: false,
      startedAt: startedAtRef.current,
      pausedAt: timerState.remainingMs,
      durationMs,
    });
  };

  const reset = () => {
    startedAtRef.current = null;
    pausedAtRef.current = null;
    dispatch({ type: 'RESET', payload: { durationMs } });

    // Clear saved state
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
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
