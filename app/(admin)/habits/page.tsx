import ShowHabits from "@/components/habits/habits";
import { getHabits } from "@/server/habits/queries";
import { Suspense } from "react";
import { HabitsTableSkeleton } from "@/components/habits/habits-table-skeleton";
import { PageHeader } from "@/components/page-header";
import { HabitPageCreateAction } from "@/components/habits/habit-page-actions";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const habits = await getHabits(query);

  return (
    <>
      <PageHeader action={<HabitPageCreateAction />} />
      <Suspense key={query + currentPage} fallback={<HabitsTableSkeleton />}>
        <ShowHabits habits={habits} />
      </Suspense>
    </>
  );
}
