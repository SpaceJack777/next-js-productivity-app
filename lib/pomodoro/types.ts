import { TimerSettings } from "@/lib/validation/pomodoro";

// Hook-related types
export interface TimerState {
  remainingMs: number;
  isRunning: boolean;
  isFinished: boolean;
  startedAt: number | null;
  pausedAt: number | null;
  durationMs: number;
}

export interface InternalTimerState {
  remainingMs: number;
  isRunning: boolean;
  isFinished: boolean;
}

export type TimerAction =
  | { type: "INITIALIZE"; payload: InternalTimerState }
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET"; payload: { durationMs: number } }
  | { type: "TICK"; payload: { remainingMs: number; isFinished: boolean } };

// Component-related types
export interface Timer {
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export interface Pomodoro {
  id: string;
  title: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FocusTimerInfoProps {
  sessions: Pomodoro[];
  loading?: boolean;
}

export interface TimerSettingsDialogProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

export type FocusTimerCardProps = {
  saveAction: (title: string, durationSeconds: number) => Promise<void>;
};

// Re-export TimerSettings for convenience
export type { TimerSettings };
