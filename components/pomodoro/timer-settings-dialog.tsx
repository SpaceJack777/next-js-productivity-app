"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { SettingsForm } from "@/components/settings-input";
import { timerSettingsSchema } from "@/lib/validation/pomodoro";
import { TimerSettingsDialogProps, TimerSettings } from "@/lib/pomodoro";

import { useState, useRef, useEffect } from "react";

import { Settings } from "lucide-react";

export const defaultTimerSettings: TimerSettings = {
  focusSession: 25,
  shortBreak: 5,
  longBreak: 15,
};

export function TimerSettingsDialog({
  settings,
  onSettingsChange,
}: TimerSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);
  const clampTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    return () => {
      if (clampTimeoutRef.current) {
        clearTimeout(clampTimeoutRef.current);
      }
    };
  }, []);

  const handleSave = () => {
    try {
      const validatedSettings = timerSettingsSchema.parse(localSettings);
      onSettingsChange(validatedSettings);
      setOpen(false);
    } catch {
      return;
    }
  };

  const handleCancel = () => {
    if (clampTimeoutRef.current) {
      clearTimeout(clampTimeoutRef.current);
    }
    setLocalSettings(settings);
    setOpen(false);
  };

  const updateSetting = (key: keyof TimerSettings, value: string) => {
    const numValue = parseInt(value);

    setLocalSettings((prev) => ({
      ...prev,
      [key]: value === "" ? "" : isNaN(numValue) ? prev[key] : numValue,
    }));

    if (clampTimeoutRef.current) {
      clearTimeout(clampTimeoutRef.current);
    }

    clampTimeoutRef.current = setTimeout(() => {
      setLocalSettings((prev) => {
        const currentValue = prev[key];
        let clampedValue = currentValue;

        if (typeof currentValue === "string" && currentValue === "") {
          return prev;
        }

        const numValue =
          typeof currentValue === "string"
            ? parseInt(currentValue)
            : currentValue;

        if (!isNaN(numValue)) {
          switch (key) {
            case "focusSession":
              clampedValue = Math.max(5, Math.min(180, numValue));
              break;
            case "shortBreak":
              clampedValue = Math.max(1, Math.min(30, numValue));
              break;
            case "longBreak":
              clampedValue = Math.max(5, Math.min(60, numValue));
              break;
          }
        }

        return {
          ...prev,
          [key]: clampedValue,
        };
      });
    }, 700);
  };

  const settingsForm = [
    {
      label: "Focus Session",
      id: "focusSession",
      value: localSettings.focusSession,
      onChange: (value: string) => updateSetting("focusSession", value),
    },
    {
      label: "Short Break",
      id: "shortBreak",
      value: localSettings.shortBreak,
      onChange: (value: string) => updateSetting("shortBreak", value),
    },
    {
      label: "Long Break",
      id: "longBreak",
      value: localSettings.longBreak,
      onChange: (value: string) => updateSetting("longBreak", value),
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen && clampTimeoutRef.current) {
          clearTimeout(clampTimeoutRef.current);
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] w-100" onEnter={handleSave}>
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>
            Configure your focus session and break durations (5-180 minutes).
          </DialogDescription>
        </DialogHeader>
        <SettingsForm settings={settingsForm} />
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
