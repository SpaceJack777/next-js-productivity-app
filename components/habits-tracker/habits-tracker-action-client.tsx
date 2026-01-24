"use client";

import type { Habit } from "@prisma/client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddHabitModal } from "./add-habit-modal";

type HabitsTrackerActionClientProps = {
  habits: Habit[];
  trackedHabitIds: string[];
};

export function HabitsTrackerActionClient({
  habits,
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
        trackedHabitIds={trackedHabitIds}
        open={open}
        action={setOpen}
      />
    </>
  );
}
