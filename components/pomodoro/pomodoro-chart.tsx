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
  // Transform sessions data for the chart
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

  // Calculate the maximum duration for the scale
  const maxMinutes =
    sessions.length > 0
      ? Math.max(
          ...sessions.map((session) => Math.round(session.duration / 60)),
        )
      : 25; // Default to 25 if no sessions

  // Generate tick marks at 5-minute intervals
  const ticks = Array.from(
    { length: Math.ceil(maxMinutes / 5) + 1 },
    (_, i) => i * 5,
  ).filter((tick) => tick <= maxMinutes);

  const chartConfig = {
    minutes: {
      label: "Focus Time (minutes)",
      color: "hsl(var(--primary))",
    },
  };

  if (sessions.length === 0) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No sessions completed yet</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="max-h-[440px]">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: -10,
          right: 10,
        }}
      >
        <XAxis
          type="number"
          dataKey="minutes"
          domain={[0, maxMinutes]}
          ticks={ticks}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value} min`}
        />
        <YAxis
          dataKey="session"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={40}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name, props) => [
                `${value} minutes`,
                `${props.payload.title || `Session ${props.payload.session}`} - ${props.payload.time} - ${props.payload.date}`,
              ]}
              labelFormatter={() => ""}
            />
          }
        />
        <Bar dataKey="minutes" fill="var(--color-primary)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
