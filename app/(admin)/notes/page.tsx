import { getSession } from "@/lib/get-session";

import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/auth/signin");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">Notes Page</div>
  );
}
