"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TotalFocusSessionsSkeleton } from "./skeletons/total-focus-sessions-skeleton";
import { EmptyState } from "../ui/empty-state";
import { Calendar } from "lucide-react";
import { usePomodoroData } from "@/contexts/pomodoro-context";

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TotalFocusSessions() {
  const { allSessions: sessions, loading } = usePomodoroData();
  const [chartData, setChartData] = React.useState<
    Array<{ date: string; sessions: number }>
  >([]);

  React.useEffect(() => {
    const sessionsByDate = sessions.reduce(
      (acc, session) => {
        const sessionDate = new Date(session.createdAt);
        const dateStr = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, "0")}-${String(sessionDate.getDate()).padStart(2, "0")}`;
        acc[dateStr] = (acc[dateStr] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const allDates: Array<{ date: string; sessions: number }> = [];
    const currentDate = new Date(thirtyDaysAgo);

    while (currentDate <= today) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
      allDates.push({
        date: dateStr,
        sessions: sessionsByDate[dateStr] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setChartData(allDates);
  }, [sessions]);

  if (loading) {
    return <TotalFocusSessionsSkeleton />;
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col gap-1 px-4 pt-4 pb-3 sm:py-0!">
            <CardTitle>Total Focus Sessions</CardTitle>
            <CardDescription>
              Showing sessions for the last 30 days
            </CardDescription>
          </div>
          <div className="flex">
            <div className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col gap-1 border-t p-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-4 sm:py-4 sm:pt-0!">
              <span className="text-muted-foreground text-xs">
                Total Sessions
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                n {sessions.length.toLocaleString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          {sessions.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No sessions yet"
              description="Complete your first focus session to see your statistics."
            />
          ) : (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: -40,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="sessions"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Bar dataKey="sessions" fill="var(--color-sessions)" />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
