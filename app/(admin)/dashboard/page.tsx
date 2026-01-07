import { getSession } from '@/lib/get-session';

import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return <div className="flex flex-1 flex-col gap-4 p-4 pt-0">Dashboard</div>;
}
