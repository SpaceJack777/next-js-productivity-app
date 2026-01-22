import { useState, useMemo } from "react";

type UsePaginationProps<T> = {
  items: T[];
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

export function usePagination<T>({
  items,
  itemsPerPage = 10,
  currentPage: externalCurrentPage,
  onPageChange,
}: UsePaginationProps<T>) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = onPageChange ?? setInternalCurrentPage;

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
  };
}
