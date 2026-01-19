import { TimerSettings } from "@/lib/validation/pomodoro";

export type SessionType = "focus" | "break";

// Hook-related types
export type TimerState = {
  remainingMs: number;
  isRunning: boolean;
  isFinished: boolean;
  startedAt: number | null;
  pausedAt: number | null;
  durationMs: number;
};

export type InternalTimerState = {
  remainingMs: number;
  isRunning: boolean;
  isFinished: boolean;
};

export type TimerAction =
  | { type: "INITIALIZE"; payload: InternalTimerState }
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET"; payload: { durationMs: number } }
  | { type: "TICK"; payload: { remainingMs: number; isFinished: boolean } };

// Component-related types
export type Timer = {
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
};

export type Pomodoro = {
  id: string;
  title: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FocusTimerInfoProps = {
  sessions: Pomodoro[];
  loading?: boolean;
};

export type TimerSettingsDialogProps = {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
};

export type FocusTimerCardProps = {
  saveAction: (title: string, durationSeconds: number) => Promise<void>;
};

// Re-export TimerSettings for convenience
export type { TimerSettings };
