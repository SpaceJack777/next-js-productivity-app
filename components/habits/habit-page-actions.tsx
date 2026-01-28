import Link from "next/link";
import { Button } from "../ui/button";
import { Plus, Undo2 } from "lucide-react";

export function HabitPageBackAction() {
  return (
    <Button size="sm" asChild>
      <Link href="/habits">
        <Undo2 className="size-3.5" />
        Back
      </Link>
    </Button>
  );
}

export function HabitPageCreateAction() {
  return (
    <Button size="sm" asChild>
      <Link href="/habits/create">
        <Plus className="size-3.5" />
        Create Habit
      </Link>
    </Button>
  );
}
