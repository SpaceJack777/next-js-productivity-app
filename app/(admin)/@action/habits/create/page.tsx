import Link from "next/link";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HabitsAction() {
  return (
    <Button size="sm" asChild>
      <Link href="/habits">
        <Undo2 className="size-3.5" />
        Back
      </Link>
    </Button>
  );
}
