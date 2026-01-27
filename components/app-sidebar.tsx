"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/animate-ui/components/radix/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useSession } from "@/lib/session-context";

import * as React from "react";

import {
  AudioWaveform,
  Clock,
  Command,
  Notebook,
  GalleryVerticalEnd,
  LayoutDashboard,
  Glasses,
  AlarmClockPlus,
  Rocket,
} from "lucide-react";
import Link from "next/link";

const nav = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Focus Timer",
      url: "/focus-timer",
      icon: Clock,
    },
    {
      title: "Notes",
      url: "/notes",
      icon: Notebook,
    },
    {
      title: "Habits Tracker",
      url: "/habits-tracker",
      icon: Glasses,
    },
    {
      title: "Habits",
      url: "/habits",
      icon: AlarmClockPlus,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();

  const data = {
    user: {
      name: session.user?.name || "User",
      email: session.user?.email || "",
      avatar: session.user?.image || "/avatars/shadcn.jpg",
    },
    ...nav,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/dashboard">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Rocket className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Space prod.</span>
              <span className="truncate text-xs">Productivity</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
