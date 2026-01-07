import { getSession } from '@/lib/get-session';

import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/auth/signin');
  }
}
