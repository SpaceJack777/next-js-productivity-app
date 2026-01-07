'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Settings } from 'lucide-react';

interface TimerSettingsProps {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  onFocusTimeChange: (time: number) => void;
  onShortBreakChange: (time: number) => void;
  onLongBreakChange: (time: number) => void;
}

export function TimerSettings({
  focusTime,
  shortBreak,
  longBreak,
  onFocusTimeChange,
  onShortBreakChange,
  onLongBreakChange,
}: TimerSettingsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogDescription>
            Configure your Pomodoro timer intervals.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="focus-time" className="text-right">
              Focus Time
            </Label>
            <Input
              id="focus-time"
              type="number"
              min="1"
              max="60"
              value={focusTime}
              onChange={(e) => onFocusTimeChange(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="short-break" className="text-right">
              Short Break
            </Label>
            <Input
              id="short-break"
              type="number"
              min="1"
              max="30"
              value={shortBreak}
              onChange={(e) => onShortBreakChange(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="long-break" className="text-right">
              Long Break
            </Label>
            <Input
              id="long-break"
              type="number"
              min="1"
              max="60"
              value={longBreak}
              onChange={(e) => onLongBreakChange(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
