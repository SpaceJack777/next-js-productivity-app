"use client";

import { Skeleton } from "../../ui/skeleton";

export function TodayFocusSessionsSkeleton() {
  return (
    <>
      <div className="space-y-2 mb-6">
        <div className="flex gap-4">
          <div>
            <Skeleton className="h-8 w-12 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-[200px]">
        <Skeleton className="h-full w-full" />
      </div>
    </>
  );
}
