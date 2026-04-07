"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type PaginationProps = {
  page: number;
  perPage: number;
  total?: number;
  dataLength: number;
  onNext: () => void;
  onPrev: () => void;
  onPageChange?: (page: number) => void;
};

export default function Pagination({
  page,
  perPage,
  total,
  dataLength,
  onNext,
  onPrev,
  onPageChange,
}: PaginationProps) {
  const totalPages = total ? Math.ceil(total / perPage) : undefined;
  const hasNext = total ? page < totalPages! : dataLength === perPage;

  const getPages = () => {
    if (!totalPages) return [];

    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "...")[] = [];

    // Always show first page
    pages.push(1);

    // Window of pages around current: clamp so it never touches page 1 or totalPages
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    // Leading ellipsis if the window doesn't start right after page 1
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    // Trailing ellipsis if the window doesn't end right before the last page
    if (end < totalPages - 1) pages.push("...");

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex flex-col w-full md:flex-row items-center justify-between mt-6 gap-4 md:gap-0">
      {total && (
        <p className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-700">{page}</span> of{" "}
          <span className="font-medium text-gray-700">{totalPages}</span> —{" "}
          <span className="font-medium text-gray-700">{total}</span> results
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="px-3 py-2 flex text-slate-700 items-center rounded-lg border text-sm font-medium bg-white hover:bg-gray-100 transition disabled:opacity-40"
        >
          <ChevronLeftIcon className="h-4 w-4" /> Prev
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange?.(p)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                p === page
                  ? "bg-green-600 text-white border-green-600 shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="px-3 py-2 text-slate-700 flex items-center rounded-lg border text-sm font-medium bg-white hover:bg-gray-100 transition disabled:opacity-40"
        >
          Next <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
