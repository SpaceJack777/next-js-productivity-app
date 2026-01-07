"use client";

import { Skeleton } from "../ui/skeleton";
import { TableRow, TableCell } from "../ui/table";

export function FocusTimerTableSkeleton() {
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-16" />
        </TableCell>
        <TableCell className="text-muted-foreground">
          <Skeleton className="h-4 w-24" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">
          <Skeleton className="h-4 w-28" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-12" />
        </TableCell>
        <TableCell className="text-muted-foreground">
          <Skeleton className="h-4 w-20" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">
          <Skeleton className="h-4 w-36" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-14" />
        </TableCell>
        <TableCell className="text-muted-foreground">
          <Skeleton className="h-4 w-22" />
        </TableCell>
      </TableRow>
    </>
  );
}
