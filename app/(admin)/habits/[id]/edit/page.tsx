import { HabitForm } from "@/components/habits/habit-form";
import { getHabitById } from "@/server/habits/queries";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const habit = await getHabitById(id);

  if (!habit) {
    notFound();
  }

  return <HabitForm mode="edit" habit={habit} />;
}
