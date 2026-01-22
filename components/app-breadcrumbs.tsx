"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";

const CUSTOM_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  habits: "Habits",
  create: "Create Habit",
  edit: "Edit Habit",
  "focus-timer": "Focus Timer",
  notes: "Notes",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  const formatSegment = (segment: string): string | null => {
    if (CUSTOM_LABELS[segment]) {
      return CUSTOM_LABELS[segment];
    }

    if (segment.match(/^[a-z0-9]{20,}$/i)) {
      return null;
    }

    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments
    .map((segment, index) => {
      const formatted = formatSegment(segment);
      if (!formatted) return null;

      const href = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;

      return {
        label: formatted,
        href,
        isLast,
      };
    })
    .filter((crumb): crumb is NonNullable<typeof crumb> => crumb !== null);

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <BreadcrumbItem className="hidden md:block">
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLast && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
