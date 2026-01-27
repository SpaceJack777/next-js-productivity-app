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
  completionMap: Record<string, boolean>;
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
  trackedHabitIds: string[];
};

export type AddHabitModalProps = {
  habits: Habit[];
  trackedHabitIds: string[];
  open: boolean;
  action: (open: boolean) => void;
};
