"use client";

import {
  Target,
  Flame,
  Dumbbell,
  BookOpen,
  Coffee,
  Moon,
  Heart,
  Zap,
  Trophy,
  Star,
  type LucideIcon,
} from "lucide-react";

const habitIcons = [
  { name: "Target", icon: Target },
  { name: "Flame", icon: Flame },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "BookOpen", icon: BookOpen },
  { name: "Coffee", icon: Coffee },
  { name: "Moon", icon: Moon },
  { name: "Heart", icon: Heart },
  { name: "Zap", icon: Zap },
  { name: "Trophy", icon: Trophy },
  { name: "Star", icon: Star },
] as const;

export const habitIconMap: Record<string, LucideIcon> = {
  Target,
  Flame,
  Dumbbell,
  BookOpen,
  Coffee,
  Moon,
  Heart,
  Zap,
  Trophy,
  Star,
};

export type HabitIconName = (typeof habitIcons)[number]["name"];

type HabitIconSelectorProps = {
  selectedIcon: HabitIconName;
  onIconSelectAction: (icon: HabitIconName) => void;
};

export function HabitIconSelector({
  selectedIcon,
  onIconSelectAction,
}: HabitIconSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">Icon</label>
      <input type="hidden" name="icon" value={selectedIcon} />
      <div className="grid grid-cols-5 gap-3">
        {habitIcons.map(({ name, icon: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => onIconSelectAction(name)}
            className={`relative h-14 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-105 ${
              selectedIcon === name
                ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20"
                : "border-input hover:border-primary/50 hover:bg-accent"
            }`}
            aria-label={`Select ${name} icon`}
          >
            <Icon className="h-6 w-6" />
          </button>
        ))}
      </div>
    </div>
  );
}
