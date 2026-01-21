import ShowHabits from "@/components/habits/habits-show";
import { getHabits } from "@/server/habits/queries";

export default async function Page() {
  const habits = await getHabits();

  return <ShowHabits habits={habits} />;
}
