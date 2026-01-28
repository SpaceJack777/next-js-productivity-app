import { getSession } from "@/lib/get-session";
import { getNotesFolders } from "@/server/notes-folders/queries";
import { getNotes } from "@/server/notes/queries";
import { redirect } from "next/navigation";
import NotesWorkspace from "@/components/notes/notes-workspace";
import { PageHeader } from "@/components/page-header";

export default async function Page() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const [folders, notes] = await Promise.all([
    getNotesFolders(session.user.id),
    getNotes(session.user.id),
  ]);

  return (
    <>
      <PageHeader />
      <NotesWorkspace folders={folders} notes={notes} />
    </>
  );
}
