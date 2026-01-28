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

export type HabitsTrackerActionsProps = {
  onDeleteAction: () => void;
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

export type DeleteUpdate = {
  habitId: string;
};

export type HabitsTrackerContainerProps = {
  habits: Habit[];
  trackedHabits: TrackedHabit[];
  trackedHabitIds: string[];
  completionsByDate: Record<string, Record<string, boolean>>;
  selectedDate: string;
  days: Array<{ key: string; dayName: string; dayNumber: string }>;
};

export type HabitsTrackerProps = {
  trackedHabits: TrackedHabit[];
  completionsByDate: Record<string, Record<string, boolean>>;
  selectedDate: string;
  days: Array<{ key: string; dayName: string; dayNumber: number }>;
  activeDate: string;
  onSelectDateAction: (dateKey: string) => void;
  onDeleteHabitAction: (habitId: string) => void;
  onToggleCompletionAction: (
    habitId: string,
    date: string,
    completed: boolean,
  ) => void;
};

export type HabitsTrackerActionClientProps = {
  habits: Habit[];
  trackedHabitIds: string[];
  onToggleHabitAction: (habitId: string, isTracked: boolean) => void;
};

export type AddHabitModalProps = {
  habits: Habit[];
  trackedHabitIds: string[];
  open: boolean;
  action: (open: boolean) => void;
  onToggleHabitAction: (habitId: string, isTracked: boolean) => void; // Renamed
};
