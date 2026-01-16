import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex gap-4 h-full">
      <Skeleton className="w-[300px] h-full" />
      <Skeleton className="w-[300px] h-full" />
      <Skeleton className="flex-1 h-full" />
    </div>
  );
}
