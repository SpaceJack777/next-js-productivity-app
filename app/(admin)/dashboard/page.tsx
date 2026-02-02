import { Dashboard } from "@/components/dashboard/dahsboard";
import { PageHeader } from "@/components/page-header";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <>
      <PageHeader />
      <Dashboard />
    </>
  );
}
