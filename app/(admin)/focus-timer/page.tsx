import { FocusTimerCard } from "@/components/pomodoro/focus-timer-card";
import { PomodoroSessionsClient } from "@/components/pomodoro/pomodoro-sessions-client";
import { getSession } from "@/lib/get-session";
import { savePomodoro } from "@/server/pomodoro/actions";

import { redirect } from "next/navigation";

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
