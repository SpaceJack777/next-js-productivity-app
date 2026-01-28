import { HabitForm } from "@/components/habits/habit-form";
import { PageHeader } from "@/components/page-header";
import { getHabitById } from "@/server/habits/queries";
import { notFound } from "next/navigation";
import { HabitPageBackAction } from "@/components/habits/habit-page-actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const habit = await getHabitById(id);

  if (!habit) {
    notFound();
  }

  return (
    <>
      <PageHeader action={<HabitPageBackAction />} />
      <HabitForm mode="edit" habit={habit} />
    </>
  );
}
