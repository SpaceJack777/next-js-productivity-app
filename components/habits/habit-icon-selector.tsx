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
  onIconSelect: (icon: HabitIconName) => void;
};

export function HabitIconSelector({
  selectedIcon,
  onIconSelect,
}: HabitIconSelectorProps) {
  return (
    <>
      <label>Icon</label>
      <input type="hidden" name="icon" value={selectedIcon} />
      <div className="grid grid-cols-5 gap-2 mb-4">
        {habitIcons.map(({ name, icon: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => onIconSelect(name)}
            className={`p-3 rounded-md border-2 flex items-center justify-center transition-colors ${
              selectedIcon === name
                ? "border-primary bg-primary/10"
                : "border-input hover:border-primary/50"
            }`}
          >
            <Icon className="w-6 h-6" />
          </button>
        ))}
      </div>
    </>
  );
}
