"use client";

import { useEffect, useState } from "react";
import { FocusTimerInfo } from "./focus-timer-info";
import { getPomodoroSessions } from "@/server/pomodoro/queries";
import { Pomodoro } from "@/lib/pomodoro";

let sessionsCache: Pomodoro[] = [];
let sessionsTimestamp = 0;
let invalidationCounter = 0;
const SESSIONS_CACHE_DURATION = 30 * 1000;

export function invalidateSessionsCache() {
  sessionsCache = [];
  sessionsTimestamp = 0;
  invalidationCounter++;
}

export function PomodoroSessionsClient() {
  const cacheValid =
    sessionsCache.length > 0 &&
    Date.now() - sessionsTimestamp < SESSIONS_CACHE_DURATION;

  const [sessions, setSessions] = useState<Pomodoro[]>(
    cacheValid ? sessionsCache : [],
  );
  const [loading, setLoading] = useState(!cacheValid);
  const [lastInvalidation, setLastInvalidation] = useState(invalidationCounter);

  useEffect(() => {
    const interval = setInterval(() => {
      if (invalidationCounter !== lastInvalidation) {
        setLastInvalidation(invalidationCounter);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [lastInvalidation]);

  useEffect(() => {
    if (cacheValid && invalidationCounter === lastInvalidation) return;

    const loadSessions = async () => {
      setLoading(true);
      try {
        const freshSessions = await getPomodoroSessions();
        sessionsCache = freshSessions;
        sessionsTimestamp = Date.now();
        setSessions(freshSessions);
      } catch (error) {
        console.warn("Failed to load pomodoro sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [cacheValid, lastInvalidation]);

  return <FocusTimerInfo sessions={sessions} loading={loading} />;
}
