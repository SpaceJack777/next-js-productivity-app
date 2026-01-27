"use client";

import {
  Dumbbell,
  Heart,
  Glasses,
  Sword,
  Disc3,
  Pill,
  PawPrint,
  HouseHeart,
  Phone,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";

const habitIcons = [
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Heart", icon: Heart },
  { name: "Glasses", icon: Glasses },
  { name: "Sword", icon: Sword },
  { name: "Disc3", icon: Disc3 },
  { name: "Pill", icon: Pill },
  { name: "PawPrint", icon: PawPrint },
  { name: "HouseHeart", icon: HouseHeart },
  { name: "Phone", icon: Phone },
  { name: "SquareTerminal", icon: SquareTerminal },
] as const;

export const habitIconMap: Record<string, LucideIcon> = {
  Dumbbell,
  Heart,
  Glasses,
  Sword,
  Disc3,
  Pill,
  PawPrint,
  HouseHeart,
  Phone,
  SquareTerminal,
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
