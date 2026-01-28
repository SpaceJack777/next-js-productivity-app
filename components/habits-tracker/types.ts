import type { Prisma } from "@prisma/client";

export type TrackedHabit = Prisma.HabitsTrackerGetPayload<{
  select: {
    id: true;
    habit: {
      select: {
        id: true;
        icon: true;
        name: true;
        description: true;
      };
    };
  };
}>;

export type Habit = Prisma.HabitGetPayload<{
  select: {
    id: true;
    icon: true;
    name: true;
    description: true;
  };
}>;

export type HabitsTrackerProps = {
  trackedHabits: TrackedHabit[];
  completionsByDate: Record<string, Record<string, boolean>>;
  selectedDate: string;
  progressByDayKey: Record<string, number>;
  days: { key: string; dayName: string; dayNumber: number }[];
};

export type HabitsTrackerActionsProps = {
  onDeleteAction: () => void;
  isPending: boolean;
};

export type HabitsTrackerActionClientProps = {
  habits: Habit[];
  trackedHabits: TrackedHabit[];
  trackedHabitIds: string[];
};

export type AddHabitModalProps = {
  habits: Habit[];
  trackedHabits: TrackedHabit[];
  trackedHabitIds: string[];
  open: boolean;
  action: (open: boolean) => void;
};

export type CompletionUpdate = {
  date: string;
  habitId: string;
  completed: boolean;
};

export type OptimisticAction = {
  habitId: string;
  action: "add" | "remove";
};
