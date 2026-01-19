"use client";

import { Skeleton } from "../../ui/skeleton";

export function FocusTimerStatsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
