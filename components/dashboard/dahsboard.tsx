import { FocusStats } from "./focus";
import { RecentNotes } from "./notes";
import { RecentHabits } from "./habits";

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      <FocusStats />
      <RecentNotes />
      <RecentHabits />
    </div>
  );
}
