"use client";

import { Card, CardHeader, CardContent } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

export function TotalFocusSessionsSkeleton() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex">
            <div className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <Skeleton className="aspect-auto h-[250px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
