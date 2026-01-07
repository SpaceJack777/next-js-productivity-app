import { useState, useEffect } from "react";
import { type TimerSettings } from "@/lib/validation/pomodoro";
import { getUserSettings, updateUserSettings } from "@/server/user-timer-settings/actions";

export const defaultTimerSettings: TimerSettings = {
  focusSession: 25,
  shortBreak: 5,
  longBreak: 15,
};

export function useUserSettings() {
  const [settings, setSettings] = useState<TimerSettings>(defaultTimerSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings);
      } catch (error) {
        console.warn("Failed to load user settings:", error);
        // Fall back to defaults if loading fails
        setSettings(defaultTimerSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: TimerSettings) => {
    setIsSaving(true);
    try {
      await updateUserSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save user settings:", error);
      throw error; // Re-throw so the component can handle the error
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