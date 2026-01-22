import HabitsEditForm from "@/components/habits/habits-edit-form";
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

  return <HabitsEditForm habit={habit} />;
}
