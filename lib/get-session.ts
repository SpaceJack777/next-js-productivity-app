// lib/get-session.ts
import { authOptions } from './auth';

import { getServerSession } from 'next-auth';

export async function getSession() {
  return await getServerSession(authOptions);
}
