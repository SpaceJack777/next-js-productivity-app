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
            <Skeleton className="size-3.5 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="size-8 rounded-md" />
        </div>
      </header>
      <div className="flex gap-4 h-full">
        <Skeleton className="w-[300px] h-full" />
        <Skeleton className="w-[300px] h-full" />
        <Skeleton className="flex-1 h-full" />
      </div>
    </>
  );
}
