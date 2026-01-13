import NotesWorkspace from "@/components/notes/notes-workspace";
import { getSession } from "@/lib/get-session";

import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/auth/signin");

  return <NotesWorkspace />;
}
