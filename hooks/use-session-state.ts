import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Timer {
  reset: () => void;
  isFinished: boolean;
  isRunning: boolean;
}

interface SessionState {
  sessionDuration: number;
  sessionStarted: boolean;
  setSessionDuration: (duration: number) => void;
  setSessionStarted: (started: boolean) => void;
  resetSession: () => void;
}

const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionDuration: 25,
      sessionStarted: false,
      setSessionDuration: (duration) => set({ sessionDuration: duration }),
      setSessionStarted: (started) => set({ sessionStarted: started }),
      resetSession: () => set({ sessionStarted: false }),
    }),
    {
      name: "session-storage",
      partialize: (state) => ({
        sessionDuration: state.sessionDuration,
        sessionStarted: state.sessionStarted,
      }),
    },
  ),
);

interface UseSessionStateProps {
  timerSettings: { focusSession: number };
  saveAction: (title: string, durationSeconds: number) => Promise<void>;
}

export function useSessionState({
  timerSettings,
  saveAction,
}: UseSessionStateProps) {
  const {
    sessionDuration,
    sessionStarted,
    setSessionDuration,
    setSessionStarted,
    resetSession: storeResetSession,
  } = useSessionStore();

  const [isPending, startTransition] = useTransition();
  const hasSavedRef = useRef(false);
  const router = useRouter();

  const currentSessionDuration = sessionStarted
    ? sessionDuration
    : timerSettings.focusSession;

  const startSession = useCallback(() => {
    setSessionStarted(true);
  }, [setSessionStarted]);

  const resetSession = useCallback(() => {
    storeResetSession();
  }, [storeResetSession]);

  const endSessionEarly = useCallback(
    (timer: Timer, elapsedMinutes: number) => {
      if (elapsedMinutes >= 5 && !hasSavedRef.current) {
        hasSavedRef.current = true;
        startTransition(() => {
          saveAction("Focus Session (Ended Early)", elapsedMinutes * 60)
            .then(() => {
              timer.reset();
              setSessionDuration(timerSettings.focusSession);
              setSessionStarted(false);
              storeResetSession();
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
    },
    [
      timerSettings.focusSession,
      saveAction,
      startTransition,
      router,
      setSessionDuration,
      setSessionStarted,
      storeResetSession,
    ],
  );

  const handleTimerComplete = useCallback(
    (sessionDuration: number) => {
      if (!hasSavedRef.current) {
        hasSavedRef.current = true;
        startTransition(() => {
          saveAction("Focus Session", sessionDuration * 60)
            .then(() => {
              setSessionDuration(timerSettings.focusSession);
              setSessionStarted(false);
              storeResetSession();
              router.refresh();
            })
            .catch((error) => {
              console.error("Failed to save session:", error);
              hasSavedRef.current = false;
            });
        });
      }
    },
    [
      timerSettings.focusSession,
      saveAction,
      startTransition,
      router,
      setSessionDuration,
      setSessionStarted,
      storeResetSession,
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
    setSessionDuration,
    isPending,
    startSession,
    resetSession,
    endSessionEarly,
    handleTimerUpdate,
  };
}
