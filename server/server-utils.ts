import { getSession } from "@/lib/get-session";

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export function dayKeyToUTCDate(dayKey: string) {
  return new Date(`${dayKey}T00:00:00.000Z`);
}
