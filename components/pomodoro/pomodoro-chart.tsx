"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type Pomodoro } from "@/lib/pomodoro";

interface PomodoroChartProps {
  sessions: Pomodoro[];
}

export function PomodoroChart({ sessions }: PomodoroChartProps) {
  const chartData = sessions
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((session, index) => ({
      session: `${sessions.length - index}`,
      minutes: Math.round(session.duration / 60),
      time: new Date(session.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date(session.createdAt).toLocaleDateString(),
      title: session.title,
    }));

  const maxMinutes =
    sessions.length > 0
      ? Math.max(
          ...sessions.map((session) => Math.round(session.duration / 60)),
        )
      : 25;

  const roundedMax = Math.ceil(maxMinutes / 5) * 5;
  const ticks = Array.from(
    { length: Math.ceil(roundedMax / 5) + 1 },
    (_, i) => i * 5,
  );

  const chartConfig = {
    minutes: {
      label: "Focus Time (minutes)",
      color: "hsl(var(--primary))",
    },
  };

  if (sessions.length === 0) {
    return <></>;
  }

  const barHeight = 40;
  const chartHeight = Math.min(sessions.length * barHeight + 50, 440);

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full"
      style={{ height: `${chartHeight}px` }}
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 0,
          right: 16,
          top: 5,
          bottom: 5,
        }}
        barCategoryGap="25%"
      >
        <XAxis
          type="number"
          dataKey="minutes"
          domain={[0, roundedMax]}
          ticks={ticks}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis
          dataKey="session"
          type="category"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          width={32}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name, props) => [
                `${value} minutes `,
                `${props.payload.time}`,
              ]}
              labelFormatter={(value) => `Session ${value}`}
            />
          }
        />
        <Bar
          dataKey="minutes"
          fill="var(--color-primary)"
          radius={4}
          maxBarSize={28}
        />
      </BarChart>
    </ChartContainer>
  );
}
