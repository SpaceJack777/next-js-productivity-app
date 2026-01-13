import NotesFolderList from "@/components/notes/notes-folder-list";
import NotesList from "@/components/notes/notes-list";
import { getNotesFolders } from "@/server/notes-folders/queries";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function NotesWorkspace() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const folders = await getNotesFolders(session.user.id);

  return (
    <div className="flex gap-4">
      <NotesFolderList folders={folders} />
      <NotesList />
    </div>
  );
}
