import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { clearStorage, getFromStorage } from "@/lib/storage";

interface Timer {
  reset: () => void;
  isFinished: boolean;
  isRunning: boolean;
}

export type SessionType = "focus" | "break";

interface SessionState {
  sessionDuration: number;
  sessionStarted: boolean;
  sessionType: SessionType;
  completedFocusSessions: number;
  setSessionDuration: (duration: number) => void;
  setSessionStarted: (started: boolean) => void;
  setSessionType: (type: SessionType) => void;
  incrementCompletedSessions: () => void;
  resetSession: () => void;
}

const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionDuration: 25,
      sessionStarted: false,
      sessionType: "focus",
      completedFocusSessions: 0,
      setSessionDuration: (duration) => set({ sessionDuration: duration }),
      setSessionStarted: (started) => set({ sessionStarted: started }),
      setSessionType: (type) => set({ sessionType: type }),
      incrementCompletedSessions: () =>
        set((state) => ({
          completedFocusSessions: state.completedFocusSessions + 1,
        })),
      resetSession: () => set({ sessionStarted: false, sessionType: "focus" }),
    }),
    {
      name: "session-storage",
      partialize: (state) => ({
        sessionDuration: state.sessionDuration,
        sessionStarted: state.sessionStarted,
        sessionType: state.sessionType,
        completedFocusSessions: state.completedFocusSessions,
      }),
    },
  ),
);

interface UseSessionStateProps {
  timerSettings: {
    focusSession: number;
    shortBreak: number;
    longBreak: number;
  };
  saveAction: (title: string, durationSeconds: number) => Promise<void>;
}

export function useSessionState({
  timerSettings,
  saveAction,
}: UseSessionStateProps) {
  const {
    sessionDuration,
    sessionStarted,
    sessionType,
    completedFocusSessions,
    setSessionDuration,
    setSessionStarted,
    setSessionType,
    incrementCompletedSessions,
    resetSession: storeResetSession,
  } = useSessionStore();

  const [isPending, startTransition] = useTransition();
  const hasSavedRef = useRef(false);
  const router = useRouter();

  const isLongBreak =
    completedFocusSessions > 0 && completedFocusSessions % 4 === 0;

  useEffect(() => {
    const timerState = getFromStorage("pomodoro-timer-state", null);
    if (!timerState && sessionStarted) {
      setSessionStarted(false);
    }
  }, [sessionStarted, setSessionStarted]);

  useEffect(() => {
    if (!sessionStarted) {
      const expectedDuration =
        sessionType === "focus"
          ? timerSettings.focusSession
          : isLongBreak
            ? timerSettings.longBreak
            : timerSettings.shortBreak;
      if (sessionDuration !== expectedDuration) {
        clearStorage("pomodoro-timer-state");
        setSessionDuration(expectedDuration);
      }
    }
  }, [
    sessionStarted,
    sessionType,
    sessionDuration,
    timerSettings.focusSession,
    timerSettings.shortBreak,
    timerSettings.longBreak,
    isLongBreak,
    setSessionDuration,
  ]);

  const currentSessionDuration = sessionStarted
    ? sessionDuration
    : sessionType === "focus"
      ? timerSettings.focusSession
      : isLongBreak
        ? timerSettings.longBreak
        : timerSettings.shortBreak;

  const startSession = useCallback(() => {
    setSessionStarted(true);
  }, [setSessionStarted]);

  const resetSession = useCallback(() => {
    storeResetSession();
  }, [storeResetSession]);

  const endSessionEarly = useCallback(
    (timer: Timer, elapsedMinutes: number) => {
      if (sessionType === "focus") {
        if (elapsedMinutes >= 5 && !hasSavedRef.current) {
          hasSavedRef.current = true;
          startTransition(() => {
            saveAction("Focus Session (Ended Early)", elapsedMinutes * 60)
              .then(() => {
                incrementCompletedSessions();
                const nextIsLongBreak = (completedFocusSessions + 1) % 4 === 0;
                const nextBreakDuration = nextIsLongBreak
                  ? timerSettings.longBreak
                  : timerSettings.shortBreak;
                timer.reset();
                clearStorage("pomodoro-timer-state");
                setSessionDuration(nextBreakDuration);
                setSessionType("break");
                setSessionStarted(false);
                router.refresh();
              })
              .catch((error) => {
                console.error("Failed to save session:", error);
                hasSavedRef.current = false;
              });
          });
        } else {
          timer.reset();
          setSessionDuration(timerSettings.focusSession);
          setSessionStarted(false);
          storeResetSession();
        }
      } else {
        timer.reset();
        clearStorage("pomodoro-timer-state");
        setSessionDuration(timerSettings.focusSession);
        setSessionType("focus");
        setSessionStarted(false);
      }
    },
    [
      sessionType,
      completedFocusSessions,
      timerSettings.focusSession,
      timerSettings.shortBreak,
      timerSettings.longBreak,
      saveAction,
      startTransition,
      router,
      setSessionDuration,
      setSessionType,
      setSessionStarted,
      incrementCompletedSessions,
      storeResetSession,
    ],
  );

  const handleTimerComplete = useCallback(
    (sessionDuration: number, currentSessionType: SessionType) => {
      if (!hasSavedRef.current) {
        hasSavedRef.current = true;

        if (currentSessionType === "focus") {
          startTransition(() => {
            saveAction("Focus Session", sessionDuration * 60)
              .then(() => {
                incrementCompletedSessions();
                const nextIsLongBreak = (completedFocusSessions + 1) % 4 === 0;
                const nextBreakDuration = nextIsLongBreak
                  ? timerSettings.longBreak
                  : timerSettings.shortBreak;
                clearStorage("pomodoro-timer-state");
                setSessionDuration(nextBreakDuration);
                setSessionType("break");
                setSessionStarted(false);
                router.refresh();
              })
              .catch((error) => {
                console.error("Failed to save session:", error);
                hasSavedRef.current = false;
              });
          });
        } else {
          clearStorage("pomodoro-timer-state");
          setSessionDuration(timerSettings.focusSession);
          setSessionType("focus");
          setSessionStarted(false);
        }
      }
    },
    [
      completedFocusSessions,
      timerSettings.focusSession,
      timerSettings.shortBreak,
      timerSettings.longBreak,
      saveAction,
      startTransition,
      router,
      setSessionDuration,
      setSessionType,
      setSessionStarted,
      incrementCompletedSessions,
    ],
  );

  const handleTimerUpdate = useCallback(
    (timer: Timer, currentSessionDuration: number) => {
      if (timer.isFinished) {
        handleTimerComplete(currentSessionDuration, sessionType);
      } else if (!timer.isRunning && !timer.isFinished) {
        hasSavedRef.current = false;
      }
    },
    [handleTimerComplete, sessionType],
  );

  return {
    currentSessionDuration,
    sessionStarted,
    sessionType,
    isLongBreak,
    completedFocusSessions,
    setSessionStarted,
    setSessionDuration,
    isPending,
    startSession,
    resetSession,
    endSessionEarly,
    handleTimerUpdate,
  };
}
