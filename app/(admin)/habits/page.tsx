import ShowHabits from "@/components/habits/habits-show";
import { getHabits } from "@/server/habits/queries";
import { Suspense } from "react";
import { HabitsTableSkeleton } from "@/components/habits/habits-table-skeleton";

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
    <Suspense key={query + currentPage} fallback={<HabitsTableSkeleton />}>
      <ShowHabits habits={habits} />
    </Suspense>
  );
}
