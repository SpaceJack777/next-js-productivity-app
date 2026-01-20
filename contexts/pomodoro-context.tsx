"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { Pomodoro } from "@/lib/pomodoro";
import {
  getPomodoroSessions,
  getTodayPomodoroSessions,
} from "@/server/pomodoro/queries";
import {
  allSessionsRefresh,
  todaySessionsRefresh,
  totalSessionsRefresh,
} from "@/lib/pomodoro/refresh-events";

interface PomodoroContextType {
  allSessions: Pomodoro[];
  todaySessions: Pomodoro[];
  loading: boolean;
  refreshAll: () => Promise<void>;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined,
);

export function PomodoroProvider({ children }: PropsWithChildren) {
  const [allSessions, setAllSessions] = useState<Pomodoro[]>([]);
  const [todaySessions, setTodaySessions] = useState<Pomodoro[]>([]);
  const [loading, setLoading] = useState(true);

  const allRefreshKey = allSessionsRefresh.useRefresh();
  const todayRefreshKey = todaySessionsRefresh.useRefresh();
  const totalRefreshKey = totalSessionsRefresh.useRefresh();

  const fetchData = async () => {
    try {
      const [all, today] = await Promise.all([
        getPomodoroSessions(),
        getTodayPomodoroSessions(),
      ]);
      setAllSessions(all);
      setTodaySessions(today);
    } catch (error) {
      console.warn("Failed to load pomodoro sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [allRefreshKey, todayRefreshKey, totalRefreshKey]);

  const refreshAll = async () => {
    setLoading(true);
    await fetchData();
  };

  return (
    <PomodoroContext.Provider
      value={{ allSessions, todaySessions, loading, refreshAll }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoroData() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error("usePomodoroData must be used within a PomodoroProvider");
  }
  return context;
}
