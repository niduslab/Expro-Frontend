"use client";

import { ArrowRight, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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

  // generate page numbers (with ellipsis)
  const getPages = () => {
    if (!totalPages) return [];

    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-4 md:gap-10 mt-10 flex-wrap">
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg border text-sm font-medium flex items-center
        bg-white hover:bg-gray-100 transition disabled:opacity-40"
      >
        <ChevronLeftIcon className="h-4 w-4" /> Previous
      </button>

      {/* Page numbers */}
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange?.(p)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition
              ${
                p === page
                  ? "bg-green-600 text-white border-green-600 shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-3 py-2 flex items-center rounded-lg border text-sm font-medium 
        bg-white hover:bg-gray-100 transition disabled:opacity-40"
      >
        Next <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
