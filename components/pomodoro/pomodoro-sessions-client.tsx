"use client";

import { useEffect, useState } from "react";
import { FocusTimerInfo } from "./focus-timer-info";
import { getPomodoroSessions } from "@/server/pomodoro/queries";

type Pomodoro = {
  id: string;
  title: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
};

let sessionsCache: Pomodoro[] = [];
let sessionsTimestamp = 0;
const SESSIONS_CACHE_DURATION = 30 * 1000;

export function invalidateSessionsCache() {
  sessionsCache = [];
  sessionsTimestamp = 0;
}

export function PomodoroSessionsClient() {
  const [sessions, setSessions] = useState<Pomodoro[]>(sessionsCache);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      if (
        sessionsCache.length > 0 &&
        Date.now() - sessionsTimestamp < SESSIONS_CACHE_DURATION
      ) {
        setSessions(sessionsCache);
        setLoading(false);
        return;
      }

      try {
        const freshSessions = await getPomodoroSessions();
        sessionsCache = freshSessions;
        sessionsTimestamp = Date.now();
        setSessions(freshSessions);
      } catch (error) {
        console.warn("Failed to load pomodoro sessions:", error);
        if (sessionsCache.length > 0) {
          setSessions(sessionsCache);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  return <FocusTimerInfo sessions={sessions} loading={loading} />;
}
