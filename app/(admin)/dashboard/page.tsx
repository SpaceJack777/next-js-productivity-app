import { getSession } from '@/lib/get-session';

import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Welcome back!
          </div>
          <div className="text-2xl font-bold">
            {session.user?.name || 'User'}
          </div>
        </div>
      </div>
    </div>
  );
}
