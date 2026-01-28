import { HabitForm } from "@/components/habits/habit-form";
import { PageHeader } from "@/components/page-header";
import { HabitPageBackAction } from "@/components/habits/habit-page-actions";

export default function Page() {
  return (
    <>
      <PageHeader action={<HabitPageBackAction />} />
      <HabitForm mode="create" />
    </>
  );
}
