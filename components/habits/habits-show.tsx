"use client";

import type { Habit } from "@prisma/client";
import { usePagination } from "@/hooks/use-pagination";
import { AppPagination } from "@/components/app-pagination";
import { HabitDeleteDialog } from "./habit-delete-dialog";

type ShowHabitsProps = {
  habits: Habit[];
  itemsPerPage?: number;
};

export default function ShowHabits({
  habits,
  itemsPerPage = 3,
}: ShowHabitsProps) {
  const { currentPage, totalPages, paginatedItems, setCurrentPage } =
    usePagination({
      items: habits,
      itemsPerPage,
    });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {paginatedItems.map((habit) => (
          <div
            key={habit.id}
            className="border rounded-lg p-4 flex items-start justify-between"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{habit.name}</h3>
              <p className="text-sm text-muted-foreground">
                {habit.description}
              </p>
              <div className="mt-2 flex gap-4 text-sm">
                <span>Status: {habit.status}</span>
                <span>Created: {habit.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
            <HabitDeleteDialog habitId={habit.id} habitName={habit.name} />
          </div>
        ))}
      </div>

      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
