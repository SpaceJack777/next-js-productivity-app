import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl">
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
