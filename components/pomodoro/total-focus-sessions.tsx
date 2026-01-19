"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import { getPomodoroSessions } from "@/server/pomodoro/queries";
import { TotalFocusSessionsSkeleton } from "./skeletons/total-focus-sessions-skeleton";

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TotalFocusSessions() {
  const [chartData, setChartData] = React.useState<
    Array<{ date: string; sessions: number }>
  >([]);
  const [totalSessions, setTotalSessions] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSessions() {
      try {
        const sessions = await getPomodoroSessions();

        // Group sessions by date and count them
        const sessionsByDate = sessions.reduce(
          (acc, session) => {
            const date = session.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD format
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        // Convert to chart data format and sort by date
        const chartDataArray = Object.entries(sessionsByDate)
          .map(([date, sessions]) => ({ date, sessions }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Get last 30 days of data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentData = chartDataArray.filter(
          (item) => new Date(item.date) >= thirtyDaysAgo,
        );

        setChartData(recentData);
        setTotalSessions(sessions.length);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

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
                {totalSessions.toLocaleString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
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
        </CardContent>
      </Card>
    </div>
  );
}
