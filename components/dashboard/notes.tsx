import { getNotes } from "@/server/notes/queries";
import { getSession } from "@/lib/get-session";
import { DashboardStatCard } from "./dashboard-stat-card";

export async function RecentNotes() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const notes = await getNotes(session.user.id);
  const totalNotes = notes.length;
  const lastNote = notes[0];
  console.log(notes);

  const stats = [
    { label: "Last Note", value: lastNote?.title ?? "—" },
    { label: "Total Notes", value: totalNotes },
  ];

  return (
    <>
      <DashboardStatCard
        title="Recent Notes"
        viewAllHref="/notes"
        viewAllLabel="View all"
        stats={stats}
      />
    </>
  );
}
