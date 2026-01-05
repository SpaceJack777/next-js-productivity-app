import { getSession } from "@/lib/get-session";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {session?.user?.name || "User"}
        </h1>
      </div>
    </div>
  );
}
