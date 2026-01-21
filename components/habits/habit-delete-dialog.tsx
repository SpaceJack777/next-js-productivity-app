"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionDialog } from "@/components/action-dialog";
import { deleteHabit } from "@/server/habits/actions";

type HabitDeleteDialogProps = {
  habitId: string;
  habitName: string;
};

export function HabitDeleteDialog({
  habitId,
  habitName,
}: HabitDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    await deleteHabit(habitId);
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>

      <ActionDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
        title="Delete Habit"
        description={`Are you sure you want to delete "${habitName}"? This action cannot be undone.`}
        confirm="Delete"
        variant="destructive"
      />
    </>
  );
}
