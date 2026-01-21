import { Input } from "../ui/input";
import { createHabit } from "@/server/habits/actions";
import SubmitButton from "../submit-button";
import { redirect } from "next/navigation";

async function createHabitsAction(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const status = formData.get("status") as string;
  const description = formData.get("description") as string;

  await createHabit({
    name,
    description,
    status,
  });

  redirect("/habits");
}

export default function HabitsCreateForm() {
  "use client";

  return (
    <div>
      <form action={createHabitsAction}>
        <label htmlFor="name">Name</label>
        <Input type="text" name="name" id="name" />
        <label htmlFor="description">Description</label>
        <Input type="text" name="description" id="description" />
        <label htmlFor="status">Status</label>
        <Input type="text" name="status" id="status" />
        <SubmitButton>Create note</SubmitButton>
      </form>
    </div>
  );
}
