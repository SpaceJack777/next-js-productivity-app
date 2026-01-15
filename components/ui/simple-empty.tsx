import { FileQuestion } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "./empty";
import type { LucideIcon } from "lucide-react";

type SimpleEmptyProps = {
  message?: string;
  icon?: LucideIcon;
};

export function SimpleEmpty({
  message = "No data",
  icon: Icon = FileQuestion,
}: SimpleEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{message}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
