import { getSession } from "@/lib/get-session";
import { savePomodoro } from "@/server/pomodoro/actions";
import { redirect } from "next/navigation";
import { FocusTimerCard, PomodoroSessionsClient } from "@/components/pomodoro";

export const revalidate = 0;

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/auth/signin");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FocusTimerCard saveAction={savePomodoro} />
      <PomodoroSessionsClient />
    </div>
  );
}
