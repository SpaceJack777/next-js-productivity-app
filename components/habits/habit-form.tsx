"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import SubmitButton from "../submit-button";
import type { Habit } from "@prisma/client";
import { useState } from "react";
import { createHabitAction, updateHabitAction } from "@/server/habits/actions";
import { HabitIconSelector, type HabitIconName } from "./habit-icon-selector";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type HabitFormProps = {
  habit?: Habit;
  mode: "create" | "edit";
};

export function HabitForm({ habit, mode }: HabitFormProps) {
  const [selectedIcon, setSelectedIcon] = useState<HabitIconName>(
    (habit?.icon as HabitIconName) || "Target",
  );

  const isEdit = mode === "edit";
  const action = isEdit ? updateHabitAction : createHabitAction;
  const title = isEdit ? "Edit Habit" : "Create New Habit";
  const submitText = isEdit ? "Update Habit" : "Create Habit";

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          {isEdit && <input type="hidden" name="id" value={habit?.id} />}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              defaultValue={habit?.name}
              placeholder="Enter habit name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              name="description"
              id="description"
              defaultValue={habit?.description}
              placeholder="Describe your habit"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={habit?.status || "active"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <HabitIconSelector
            selectedIcon={selectedIcon}
            onIconSelectAction={setSelectedIcon}
          />

          <SubmitButton className="w-full">{submitText}</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
