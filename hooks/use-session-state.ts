import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Timer {
  reset: () => void;
  isFinished: boolean;
  isRunning: boolean;
}

interface UseSessionStateProps {
  timerSettings: { focusSession: number };
  saveAction: (title: string, durationSeconds: number) => Promise<void>;
}

export function useSessionState({
  timerSettings,
  saveAction,
}: UseSessionStateProps) {
  // Helper functions for localStorage
  const getStoredSessionDuration = (): number => {
    if (typeof window === "undefined") return timerSettings.focusSession;
    const saved = localStorage.getItem("currentSessionDuration");
    return saved ? parseInt(saved) : timerSettings.focusSession;
  };

  const getStoredSessionStarted = (): boolean => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("sessionStarted");
    return saved === "true";
  };

  const setStoredSessionDuration = (duration: number): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentSessionDuration", duration.toString());
    }
  };

  const setStoredSessionStarted = (started: boolean): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sessionStarted", started.toString());
    }
  };

  const clearStoredSession = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sessionStarted");
      localStorage.removeItem("currentSessionDuration");
    }
  };

  // State
  const [storedSessionDuration, setStoredSessionDurationState] =
    useState<number>(getStoredSessionDuration);
  const [sessionStarted, setSessionStarted] = useState<boolean>(
    getStoredSessionStarted,
  );
  const [isPending, startTransition] = useTransition();

  // Derive current session duration: use stored value if session running, otherwise use settings
  const currentSessionDuration = useMemo(() => {
    return sessionStarted ? storedSessionDuration : timerSettings.focusSession;
  }, [sessionStarted, storedSessionDuration, timerSettings.focusSession]);

  // Refs
  const hasSavedRef = useRef(false);
  const router = useRouter();

  // Persist to localStorage
  useEffect(() => {
    setStoredSessionStarted(sessionStarted);
  }, [sessionStarted]);

  useEffect(() => {
    setStoredSessionDuration(storedSessionDuration);
  }, [storedSessionDuration]);

  // Session management functions
  const startSession = useCallback(() => {
    setSessionStarted(true);
  }, []);

  const resetSession = useCallback(() => {
    setSessionStarted(false);
    clearStoredSession();
  }, []);

  const endSessionEarly = useCallback(
    (timer: Timer, elapsedMinutes: number) => {
      if (elapsedMinutes >= 5 && !hasSavedRef.current) {
        hasSavedRef.current = true;
        startTransition(() => {
          saveAction("Focus Session (Ended Early)", elapsedMinutes * 60).then(
            () => {
              timer.reset();
              setStoredSessionDurationState(timerSettings.focusSession);
              setSessionStarted(false);
              clearStoredSession();
              router.refresh();
            },
          );
        });
      } else {
        timer.reset();
        setStoredSessionDurationState(timerSettings.focusSession);
        setSessionStarted(false);
        clearStoredSession();
      }
    },
    [timerSettings.focusSession, saveAction, startTransition, router],
  );

  const handleTimerComplete = useCallback(
    (sessionDuration: number) => {
      if (!hasSavedRef.current) {
        hasSavedRef.current = true;
        startTransition(() => {
          saveAction("Focus Session", sessionDuration * 60).then(() => {
            setStoredSessionDurationState(timerSettings.focusSession);
            setSessionStarted(false);
            clearStoredSession();
            router.refresh();
          });
        });
      }
    },
    [timerSettings.focusSession, saveAction, startTransition, router],
  );

  const handleTimerUpdate = useCallback(
    (timer: Timer, currentSessionDuration: number) => {
      if (timer.isFinished) {
        handleTimerComplete(currentSessionDuration);
      } else if (!timer.isRunning && !timer.isFinished) {
        hasSavedRef.current = false;
      }
    },
    [handleTimerComplete],
  );

  return {
    currentSessionDuration,
    sessionStarted,
    setSessionStarted,
    isPending,
    startSession,
    resetSession,
    endSessionEarly,
    handleTimerUpdate,
  };
}
