"use client";

import { useMemo, useState } from "react";
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

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
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

function TypeBadge({ type }: { type?: string }) {
  if (!type) return <span className="text-gray-400">—</span>;
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 capitalize">
      {type.replace(/_/g, " ")}
    </span>
  );
}

function formatDate(dateStr?: string, withTime = false) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function toNumber(amount: string | number) {
  return typeof amount === "string" ? parseFloat(amount) || 0 : amount;
}

function formatAmount(amount: string | number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "BDT",
    minimumFractionDigits: 2,
  }).format(toNumber(amount));
}

// --- Summary Cards ---

function SummaryCard({
  label,
  value,
  hint,
  accent,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xl font-semibold text-gray-900 mt-1 truncate">
          {value}
        </p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
    </div>
  );
}

// --- Detail Modal ---

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-gray-100 last:border-0">
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-sm text-gray-800 break-words">{children}</dd>
    </div>
  );
}

function DonationDetailModal({
  donation,
  onClose,
}: {
  donation: Donation;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-semibold text-gray-900">
                {formatAmount(donation.amount, donation.currency)}
              </h3>
              <StatusBadge status={donation.status} />
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              Receipt {donation.receipt_number || `#${donation.id}`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto px-6 py-2">
          <dl className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
            <DetailRow label="Donor Name">
              {donation.is_anonymous ? (
                <span className="inline-flex items-center gap-1.5">
                  Anonymous
                  <span className="text-xs text-gray-400">(hidden)</span>
                </span>
              ) : (
                donation.donor_name || "—"
              )}
            </DetailRow>
            <DetailRow label="Anonymous">
              {donation.is_anonymous ? "Yes" : "No"}
            </DetailRow>
            <DetailRow label="Email">{donation.donor_email || "—"}</DetailRow>
            <DetailRow label="Phone">{donation.donor_phone || "—"}</DetailRow>
            <DetailRow label="Amount">
              {formatAmount(donation.amount, donation.currency)}
            </DetailRow>
            <DetailRow label="Currency">{donation.currency || "—"}</DetailRow>
            <DetailRow label="Type">
              <TypeBadge type={donation.type} />
            </DetailRow>
            <DetailRow label="Purpose">{donation.purpose || "—"}</DetailRow>
            <DetailRow label="Status">
              <StatusBadge status={donation.status} />
            </DetailRow>
            <DetailRow label="Receipt Number">
              {donation.receipt_number || "—"}
            </DetailRow>
            <DetailRow label="Payment ID">
              {donation.payment_id || "—"}
            </DetailRow>
            <DetailRow label="Wallet Transaction">
              {donation.wallet_transaction_id || "—"}
            </DetailRow>
            <DetailRow label="Project ID">
              {donation.project_id ?? "—"}
            </DetailRow>
            <DetailRow label="User ID">{donation.user_id ?? "—"}</DetailRow>
            <DetailRow label="Created">
              {formatDate(donation.created_at, true)}
            </DetailRow>
            <DetailRow label="Updated">
              {formatDate(donation.updated_at, true)}
            </DetailRow>
          </dl>

          {donation.message && (
            <div className="py-3 border-t border-gray-100">
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Message
              </dt>
              <dd className="text-sm text-gray-700 mt-1.5 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                {donation.message}
              </dd>
            </div>
          )}

          {donation.metadata && (
            <div className="py-3 border-t border-gray-100 mb-2">
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Metadata
              </dt>
              <dd className="text-xs text-gray-600 mt-1.5 bg-gray-50 rounded-lg p-3 font-mono whitespace-pre-wrap break-all">
                {donation.metadata}
              </dd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function DonationList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Donation | null>(null);
  const perPage = 15;

  const { data, isLoading, error } = useDonations(page, {
    per_page: perPage,
    ...(status ? { status } : {}),
  });

  const pagination = data?.pagination;
  const donations = data?.data || [];

  // Client-side search over the current page (donor name / email / receipt).
  const filteredDonations = useMemo(() => {
    if (!search.trim()) return donations;
    const q = search.trim().toLowerCase();
    return donations.filter(
      (d) =>
        d.donor_name?.toLowerCase().includes(q) ||
        d.donor_email?.toLowerCase().includes(q) ||
        d.receipt_number?.toLowerCase().includes(q),
    );
  }, [donations, search]);

  // Page-scoped summary figures.
  const pageStats = useMemo(() => {
    const completed = donations.filter((d) => d.status === "completed");
    const pending = donations.filter((d) => d.status === "pending");
    const currency = donations[0]?.currency ?? "BDT";
    const completedSum = completed.reduce((s, d) => s + toNumber(d.amount), 0);
    return {
      currency,
      completedSum,
      completedCount: completed.length,
      pendingCount: pending.length,
    };
  }, [donations]);

  const isEmpty = !isLoading && !error && donations.length === 0;
  const noMatches =
    !isLoading && !error && donations.length > 0 && filteredDonations.length === 0;

  const handleNext = () => {
    if (pagination && page < pagination.last_page) setPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Donations"
          value={(pagination?.total ?? 0).toLocaleString()}
          hint="All records"
          accent="bg-indigo-50 text-indigo-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7l8 5 8-5M4 7h16" />
            </svg>
          }
        />
        <SummaryCard
          label="Completed (page)"
          value={formatAmount(pageStats.completedSum, pageStats.currency)}
          hint={`${pageStats.completedCount} donation${pageStats.completedCount === 1 ? "" : "s"}`}
          accent="bg-emerald-50 text-emerald-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <SummaryCard
          label="Pending (page)"
          value={pageStats.pendingCount.toLocaleString()}
          hint="Awaiting confirmation"
          accent="bg-amber-50 text-amber-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <SummaryCard
          label="Current Page"
          value={`${pagination?.current_page ?? page} / ${pagination?.last_page ?? 1}`}
          hint={`${donations.length} shown`}
          accent="bg-sky-50 text-sky-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          }
        />
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Header + filters */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Donations</h2>
            {pagination?.total !== undefined && (
              <p className="text-sm text-gray-400 mt-0.5">
                {pagination.total.toLocaleString()} total records
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search (current page) */}
            <div className="relative">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, receipt…"
                className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none w-full sm:w-64 transition-colors"
              />
            </div>

            {/* Status filter (server-side) */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-colors"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Failed to load donations</p>
            <p className="text-xs text-gray-400">Please try again later</p>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && !error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No donations found</p>
            <p className="text-xs text-gray-400">Donations will appear here once received</p>
          </div>
        )}

        {/* Table */}
        {!error && !isEmpty && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Donor", "Contact", "Type / Purpose", "Amount", "Status", "Date", ""].map((h, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                  ) : noMatches ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">
                        No donations match “{search}” on this page.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((donation) => (
                      <tr
                        key={donation.id}
                        onClick={() => setSelected(donation)}
                        className="hover:bg-gray-50/70 transition-colors duration-100 cursor-pointer"
                      >
                        {/* Donor */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs flex items-center justify-center shrink-0">
                              {donation.is_anonymous
                                ? "?"
                                : (donation.donor_name?.charAt(0) || "?").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 whitespace-nowrap">
                                {donation.is_anonymous ? "Anonymous" : donation.donor_name || "—"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {donation.receipt_number || `#${donation.id}`}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          {donation.is_anonymous ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <div className="min-w-0">
                              <p className="text-gray-700 truncate max-w-[200px]">
                                {donation.donor_email || "—"}
                              </p>
                              {donation.donor_phone && (
                                <p className="text-xs text-gray-400">{donation.donor_phone}</p>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Type / Purpose */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <TypeBadge type={donation.type} />
                            {donation.purpose && (
                              <span className="text-xs text-gray-500 truncate max-w-[180px]">
                                {donation.purpose}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                          {formatAmount(donation.amount, donation.currency)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={donation.status} />
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {formatDate(donation.created_at)}
                        </td>

                        {/* View */}
                        <td className="px-6 py-4 text-right">
                          <span className="text-xs font-medium text-indigo-600 hover:text-indigo-800 whitespace-nowrap">
                            View
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

      {/* Detail modal */}
      {selected && (
        <DonationDetailModal donation={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
