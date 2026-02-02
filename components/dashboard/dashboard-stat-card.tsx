import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export interface DashboardStatItem {
  label: string;
  value: React.ReactNode;
}

interface DashboardStatCardProps {
  title: string;
  viewAllHref: string;
  viewAllLabel?: string;
  stats: DashboardStatItem[];
  loading?: boolean;
}

export function DashboardStatCard({
  title,
  viewAllHref,
  viewAllLabel = "View all",
  stats,
  loading = false,
}: DashboardStatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          {title}
          <Link className="text-sm text-muted-foreground" href={viewAllHref}>
            {viewAllLabel}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {loading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-20 w-full mb-2" />
            <Skeleton className="h-20 w-full mb-2" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
