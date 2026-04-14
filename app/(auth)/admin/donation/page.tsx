"use client";

import { useState } from "react";
import { useDonations, Donation } from "@/lib/hooks/admin/useDonations";
import Pagination from "@/components/pagination/page";

// --- Configs & Helpers ---

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
      {Array.from({ length: 5 }).map((_, i) => (
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
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: string | number, currency: string) {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "BDT",
    minimumFractionDigits: 2,
  }).format(numericAmount);
}

// --- Main Component ---

export default function DonationList() {
  const [page, setPage] = useState(1);
  const perPage = 15; // Match this with your API default or hook default

  // Fetch data
  const { data, isLoading, error } = useDonations(page, { per_page: perPage });

  // Safe access to pagination info
  // Note: The API response structure we defined earlier has 'pagination' at root
  const pagination = data?.pagination;
  const donations = data?.data || [];

  const isEmpty = !isLoading && !error && donations.length === 0;

  const handleNext = () => {
    if (pagination && page < pagination.last_page) {
      setPage((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Donations</h2>
          {pagination?.total !== undefined && (
            <p className="text-sm text-gray-400 mt-0.5">
              {pagination.total.toLocaleString()} total records
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
      {isEmpty && !error && (
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

      {/* Table Container */}
      {!error && !isEmpty && (
        <>
          <div className="overflow-x-auto flex-grow">
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
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  : donations.map((donation: Donation) => (
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
                        <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">
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

          {/* Pagination Component */}
          <div className="border-t border-gray-100 bg-gray-50/50 p-4">
            <Pagination
              page={page}
              perPage={perPage}
              total={pagination?.total}
              dataLength={donations.length}
              onNext={handleNext}
              onPrev={handlePrev}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
