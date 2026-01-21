"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

import { useSelectedLayoutSegment } from "next/navigation";

export default function Breadcrumbs() {
  const capitalizeFirstLetter = (str: string | null) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const segment = useSelectedLayoutSegment();
  const parsedSegment = capitalizeFirstLetter(segment)?.split("-").join(" ");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          {parsedSegment}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
