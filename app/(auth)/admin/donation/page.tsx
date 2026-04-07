"use client";

import { useState } from "react";
import { useDonations, Donation } from "@/lib/hooks/admin/useDonations";

const statusConfig = {
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 ring-1 ring-red-200",
    dot: "bg-red-500",
  },
  refunded: {
    label: "Refunded",
    className: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
    dot: "bg-gray-400",
  },
};

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded-md w-full" />
        </td>
      ))}
    </tr>
  );
}

function StatusBadge({ status }: { status: Donation["status"] }) {
  const config = statusConfig[status] ?? statusConfig.failed;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function DonationList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useDonations(page);

  const isEmpty =
    !isLoading && !error && (!data?.data || data.data.length === 0);
  const { current_page, last_page, total, from, to } = data?.pagination ?? {};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Donations</h2>
          {total !== undefined && (
            <p className="text-sm text-gray-400 mt-0.5">
              {total.toLocaleString()} total records
            </p>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">
            Failed to load donations
          </p>
          <p className="text-xs text-gray-400">Please try again later</p>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">
            No donations found
          </p>
          <p className="text-xs text-gray-400">
            Donations will appear here once received
          </p>
        </div>
      )}

      {/* Table */}
      {!error && !isEmpty && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Donor", "Email", "Amount", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : data!.data.map((donation: Donation) => (
                    <tr
                      key={donation.id}
                      className="hover:bg-gray-50/70 transition-colors duration-100"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs flex items-center justify-center shrink-0">
                            {donation.is_anonymous
                              ? "?"
                              : donation.donor_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800 whitespace-nowrap">
                            {donation.is_anonymous
                              ? "Anonymous"
                              : donation.donor_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {donation.is_anonymous ? "—" : donation.donor_email}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                        {formatAmount(donation.amount, donation.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={donation.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {formatDate(donation.created_at)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!error && !isEmpty && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            {isLoading ? (
              <span className="inline-block w-32 h-3 bg-gray-200 rounded animate-pulse" />
            ) : (
              <>
                Showing{" "}
                <span className="font-medium text-gray-600">
                  {from}–{to}
                </span>{" "}
                of <span className="font-medium text-gray-600">{total}</span>
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={isLoading || current_page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Prev
            </button>

            <span className="text-xs text-gray-500 px-1">
              {isLoading ? "—" : `${current_page} / ${last_page}`}
            </span>

            <button
              disabled={isLoading || current_page === last_page}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
