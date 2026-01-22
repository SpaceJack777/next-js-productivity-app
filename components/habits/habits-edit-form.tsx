"use client";

import { Input } from "../ui/input";
import SubmitButton from "../submit-button";
import type { Habit } from "@prisma/client";
import { useState } from "react";
import { updateHabitAction } from "@/server/habits/actions";
import { HabitIconSelector, type HabitIconName } from "./habit-icon-selector";

type HabitsEditFormProps = {
  habit: Habit;
};

export default function HabitsEditForm({ habit }: HabitsEditFormProps) {
  const [selectedIcon, setSelectedIcon] = useState<HabitIconName>(
    habit.icon as HabitIconName,
  );

  return (
    <div>
      <form action={updateHabitAction}>
        <input type="hidden" name="id" value={habit.id} />
        <label htmlFor="name">Name</label>
        <Input
          type="text"
          name="name"
          id="name"
          defaultValue={habit.name}
          required
        />
        <label htmlFor="description">Description</label>
        <Input
          type="text"
          name="description"
          id="description"
          defaultValue={habit.description}
          required
        />
        <label htmlFor="status">Status</label>
        <select
          name="status"
          id="status"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          defaultValue={habit.status}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <HabitIconSelector
          selectedIcon={selectedIcon}
          onIconSelect={setSelectedIcon}
        />
        <SubmitButton>Update habit</SubmitButton>
      </form>
    </div>
  );
}
