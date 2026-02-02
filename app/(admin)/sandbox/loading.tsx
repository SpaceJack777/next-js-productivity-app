import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <Skeleton className="size-7 shrink-0 rounded-md" />
          <Skeleton className="h-4 w-px mr-2" />
          <div className="flex flex-wrap items-center gap-1.5">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-8 w-30 rounded-md" />
        </div>
      </header>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-6 pb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center px-4 py-2 rounded-lg transition-colors"
              >
                <Skeleton className="h-4 w-8" />
                <div className="text-center font-medium mt-1">
                  <Skeleton className="h-4 w-5 mx-auto" />
                </div>
                <Skeleton className="size-8 rounded-full mt-1 mb-2 mx-auto" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-accent/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-background shrink-0">
                  <Skeleton className="size-5 rounded" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="size-6 rounded-[7px] shrink-0 mr-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
