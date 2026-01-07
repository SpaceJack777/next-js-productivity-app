'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/animate-ui/components/radix/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useState } from 'react';

import { Settings } from 'lucide-react';

interface TimerSettings {
  focusSession: number;
  shortBreak: number;
  longBreak: number;
}

interface TimerSettingsDialogProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

export function TimerSettingsDialog({
  settings,
  onSettingsChange,
}: TimerSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings); // Reset to original values
    setOpen(false);
  };

  const updateSetting = (key: keyof TimerSettings, value: string) => {
    const numValue = parseInt(value) || 5;
    setLocalSettings((prev) => ({
      ...prev,
      [key]: Math.max(5, Math.min(180, numValue)), // Clamp between 5-180 minutes
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] w-100">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>
            Configure your focus session and break durations (5-180 minutes).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4 justify-between">
            <Label htmlFor="focus-session" className="text-right">
              Focus duration
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="focus-session"
                type="number"
                min="5"
                max="180"
                value={localSettings.focusSession}
                onChange={(e) => updateSetting('focusSession', e.target.value)}
              />
              <span>min</span>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <Label htmlFor="short-break" className="text-right">
              Short break
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="short-break"
                type="number"
                min="1"
                max="30"
                value={localSettings.shortBreak}
                onChange={(e) => updateSetting('shortBreak', e.target.value)}
              />
              <span>min</span>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <Label htmlFor="long-break" className="text-right">
              Long break
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="long-break"
                type="number"
                min="5"
                max="60"
                value={localSettings.longBreak}
                onChange={(e) => updateSetting('longBreak', e.target.value)}
              />
              <span>min</span>
            </div>
          </div>
        </div>
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
