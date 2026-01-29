import {
  FocusTimerCard,
  PomodoroSessionsClient,
  TodayFocusSessions,
} from "@/components/pomodoro";
import { getSession } from "@/lib/get-session";
import { savePomodoro } from "@/server/pomodoro/actions";
import { redirect } from "next/navigation";
import { TotalFocusSessions } from "@/components/pomodoro/total-focus-sessions";
import { PageHeader } from "@/components/page-header";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/auth/signin");

  return (
    <>
      <PageHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FocusTimerCard saveAction={savePomodoro} />
        <TodayFocusSessions />
        <PomodoroSessionsClient />
        <TotalFocusSessions />
      </div>
    </>
  );
}
