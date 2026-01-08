import { useState, useEffect } from "react";
import { type TimerSettings } from "@/lib/validation/pomodoro";
import {
  getUserSettings,
  updateUserSettings,
} from "@/server/user-timer-settings/actions";

export const defaultTimerSettings: TimerSettings = {
  focusSession: 25,
  shortBreak: 5,
  longBreak: 15,
};

let settingsCache: TimerSettings | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export function useUserSettings() {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    if (settingsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return settingsCache;
    }
    return defaultTimerSettings;
  });
  const [isLoading, setIsLoading] = useState(() => {
    return !(settingsCache && Date.now() - cacheTimestamp < CACHE_DURATION);
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!settingsCache || Date.now() - cacheTimestamp >= CACHE_DURATION) {
      const loadSettings = async () => {
        try {
          let userSettings = await getUserSettings();
          userSettings = {
            ...userSettings,
            focusSession: 0.1,
            shortBreak: 0.2,
          };
          settingsCache = userSettings;
          cacheTimestamp = Date.now();
          setSettings(userSettings);
        } catch (error) {
          console.warn("Failed to load user settings:", error);
          if (settingsCache) {
            setSettings(settingsCache);
          } else {
            setSettings({
              ...defaultTimerSettings,
              focusSession: 0.1,
              shortBreak: 0.2,
            });
          }
        } finally {
          setIsLoading(false);
        }
      };
      loadSettings();
    } else {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = async (newSettings: TimerSettings) => {
    setIsSaving(true);
    try {
      await updateUserSettings(newSettings);
      settingsCache = newSettings;
      cacheTimestamp = Date.now();
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save user settings:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    updateSettings,
  };
}
