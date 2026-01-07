import { FocusTimerCard } from '@/components/pomodoro/focus-timer-card';
import { FocusTimerInfo } from '@/components/pomodoro/focus-timer-info';
import { getSession } from '@/lib/get-session';
import { savePomodoro } from '@/server/pomodoro/actions';
import { getPomodoroSessions } from '@/server/pomodoro/queries';

import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/auth/signin');

  const sessions = await getPomodoroSessions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FocusTimerCard saveAction={savePomodoro} />
      <FocusTimerInfo sessions={sessions} />
    </div>
  );
}
