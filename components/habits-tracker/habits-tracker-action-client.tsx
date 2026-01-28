"use client";

import { Button } from "@/components/ui/button";
import { AddHabitModal } from "./add-habit-modal";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { HabitsTrackerActionClientProps } from "./types";

export function HabitsTrackerActionClient({
  habits,
  trackedHabits,
  trackedHabitIds,
}: HabitsTrackerActionClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-3.5" />
        Add habit
      </Button>

      <AddHabitModal
        habits={habits}
        trackedHabits={trackedHabits}
        trackedHabitIds={trackedHabitIds}
        open={open}
        action={setOpen}
      />
    </>
  );
}
