"use client";

import type { Habit } from "@prisma/client";
import { usePagination } from "@/hooks/use-pagination";
import { AppPagination } from "@/components/app-pagination";
import { HabitDeleteDialog } from "./habit-delete-dialog";
import { habitIconMap } from "./habit-icon-selector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, CircleCheck, CircleMinus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Search from "../search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ShowHabitsProps = {
  habits: Habit[];
  itemsPerPage?: number;
};

export default function ShowHabits({
  habits,
  itemsPerPage: initialItemsPerPage = 10,
}: ShowHabitsProps) {
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const { totalPages, paginatedItems } = usePagination({
    items: habits,
    itemsPerPage,
    currentPage,
    onPageChange: setCurrentPage,
  });

  const getIcon = (iconName: string) => {
    const Icon = habitIconMap[iconName];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  return (
    <div className="max-w-7xl space-y-4">
      <Search placeholder="Search habits..." />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((habit) => (
                <TableRow key={habit.id}>
                  <TableCell>{getIcon(habit.icon)}</TableCell>
                  <TableCell className="font-medium">{habit.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-md truncate">
                    {habit.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-muted-foreground px-1.5 bg-transparent"
                    >
                      {habit.status === "active" ? (
                        <>
                          <CircleCheck className="fill-green-600 text-white dark:text-gray-900" />
                          Active
                        </>
                      ) : (
                        <>
                          <CircleMinus className="fill-gray-400 text-white dark:text-gray-900" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {habit.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`habits/${habit.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => setDeleteDialogOpen(habit.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <HabitDeleteDialog
                      habitId={habit.id}
                      habitName={habit.name}
                      open={deleteDialogOpen === habit.id}
                      onOpenChange={(open) =>
                        setDeleteDialogOpen(open ? habit.id : null)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No habits found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="pl-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <span>Show</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>

        <AppPagination
          className="justify-end"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChangeAction={setCurrentPage}
        />
      </div>
    </div>
  );
}
