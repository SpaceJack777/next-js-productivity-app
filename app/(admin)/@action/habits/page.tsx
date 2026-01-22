import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HabitsAction() {
  return (
    <Button size="sm" asChild>
      <Link href="/habits/create">
        <Plus className="size-3.5" />
        Create Habit
      </Link>
    </Button>
  );
}
