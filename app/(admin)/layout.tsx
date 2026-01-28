import {
  SidebarInset,
  SidebarProvider,
} from "@/components/animate-ui/components/radix/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getSession } from "@/lib/get-session";
import { SessionProvider } from "@/lib/session-context";
import { redirect } from "next/navigation";
import { PropsWithChildren, Suspense } from "react";
import { LayoutLoadingSkeleton } from "@/components/layout-loading-skeleton";

async function AuthenticatedLayout({ children }: PropsWithChildren) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<LayoutLoadingSkeleton />}>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </Suspense>
  );
}
