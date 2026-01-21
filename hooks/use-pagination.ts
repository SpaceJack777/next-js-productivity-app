import { useState, useMemo } from "react";

type UsePaginationProps<T> = {
  items: T[];
  itemsPerPage?: number;
};

export function usePagination<T>({
  items,
  itemsPerPage = 10,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

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
