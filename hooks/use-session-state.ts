import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function debounce<TArgs extends unknown[], TReturn>(
  func: (...args: TArgs) => TReturn,
  delay: number,
): (...args: TArgs) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: TArgs) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

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

  const [storedSessionDuration, setStoredSessionDurationState] =
    useState<number>(getStoredSessionDuration);
  const [sessionStarted, setSessionStarted] = useState<boolean>(
    getStoredSessionStarted,
  );

  const [isPending, startTransition] = useTransition();

  const currentSessionDuration = useMemo(() => {
    return sessionStarted ? storedSessionDuration : timerSettings.focusSession;
  }, [sessionStarted, storedSessionDuration, timerSettings.focusSession]);

  const hasSavedRef = useRef(false);
  const router = useRouter();

  const debouncedSetStoredSession = useMemo(
    () =>
      debounce((started: boolean, duration: number) => {
        setStoredSessionStarted(started);
        setStoredSessionDuration(duration);
      }, 150),
    [],
  );

  useEffect(() => {
    debouncedSetStoredSession(sessionStarted, storedSessionDuration);
  }, [sessionStarted, storedSessionDuration, debouncedSetStoredSession]);

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStarted) {
      localStorage.setItem(
        "currentSessionDuration",
        timerSettings.focusSession.toString(),
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStoredSessionDurationState(timerSettings.focusSession);
    }
  }, [
    timerSettings.focusSession,
    sessionStarted,
    setStoredSessionDurationState,
  ]);

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
    [
      timerSettings.focusSession,
      saveAction,
      startTransition,
      router,
      setStoredSessionDurationState,
      setSessionStarted,
    ],
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
    [
      timerSettings.focusSession,
      saveAction,
      startTransition,
      router,
      setStoredSessionDurationState,
      setSessionStarted,
    ],
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
