"use client";

import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: Readonly<PaginationProps>) {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const linkClass =
    "flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors";
  const activeClass =
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700";
  const disabledClass =
    "pointer-events-none text-zinc-300 dark:text-zinc-600";

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`?page=${page - 1}`}
        className={`${linkClass} ${isFirst ? disabledClass : activeClass}`}
        aria-disabled={isFirst}
      >
        Previous
      </Link>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {page} / {totalPages}
      </span>
      <Link
        href={`?page=${page + 1}`}
        className={`${linkClass} ${isLast ? disabledClass : activeClass}`}
        aria-disabled={isLast}
      >
        Next
      </Link>
    </div>
  );
}
