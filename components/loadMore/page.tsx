"use client";

import { Loader2 } from "lucide-react";

interface LoadMoreProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  loadedCount: number;
  totalCount: number;
}

const LoadMore = ({
  hasMore,
  isLoading,
  onLoadMore,
  loadedCount,
  totalCount,
}: LoadMoreProps) => {
  if (!hasMore) return null;

  return (
    <div className="flex flex-col items-center gap-3 mt-12">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-700">{loadedCount}</span>{" "}
        of <span className="font-medium text-gray-700">{totalCount}</span>{" "}
        videos
      </p>
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Load More Videos"
        )}
      </button>
    </div>
  );
};

export default LoadMore;
