"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginateProps = {
  currentPage: number;
  totalPages: number;
  onPageChangeAction: (page: number) => void;
  className?: string;
};

export function AppPagination({
  currentPage,
  totalPages,
  onPageChangeAction,
  className,
}: PaginateProps) {
  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => canGoPrevious && onPageChangeAction(currentPage - 1)}
            aria-disabled={!canGoPrevious}
            className={
              canGoPrevious
                ? "cursor-pointer"
                : "pointer-events-none opacity-50"
            }
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChangeAction(page)}
              isActive={currentPage === page}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => canGoNext && onPageChangeAction(currentPage + 1)}
            aria-disabled={!canGoNext}
            className={
              canGoNext ? "cursor-pointer" : "pointer-events-none opacity-50"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
