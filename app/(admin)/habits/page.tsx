import ShowHabits from "@/components/habits/habits-show";
import { getHabits } from "@/server/habits/queries";

export default async function Page() {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const habits = await getHabits();

  return <ShowHabits habits={habits} />;
}
