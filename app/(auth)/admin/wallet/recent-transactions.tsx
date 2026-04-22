"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
  X,
} from "lucide-react";
import {
  CompanyWalletTransaction,
  useCompanyWalletTransactions,
} from "@/lib/hooks/admin/useWallet";
import { format } from "date-fns";
import Pagination from "@/components/pagination/page";
import DatePicker from "@/components/ui/date-picker";

type Status = "completed" | "pending" | "failed";
type TransactionType = "credit" | "debit" | "all";

export const statusConfig: Record<
  Status,
  { style: string; icon: React.ReactNode; label: string }
> = {
  completed: {
    style: "bg-[#29A36A26] border border-[#29A36A4D] text-[#29A36A]",
    icon: <CheckCircle size={14} />,
    label: "Completed",
  },
  pending: {
    style: "bg-[#FEF1DA] border border-[#FBD89C] text-[#F59F0A]",
    icon: <Clock size={14} />,
    label: "Pending",
  },
  failed: {
    style: "bg-[#DC282826] border border-[#DC28284D] text-[#DC2828]",
    icon: <XCircle size={14} />,
    label: "Failed",
  },
};

const categoryLabels: Record<string, string> = {
  pension_installment: "Pension Installment",
  commission_payout: "Commission Payout",
  membership_fee: "Membership Fee",
  withdrawal: "Withdrawal",
  deposit: "Deposit",
  refund: "Refund",
};

export default function RecentTransactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<TransactionType>("all");

  // Staged date inputs (not yet sent to API)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Applied dates (actually sent to the hook/API)
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const perPage = 10;

  // ✅ All active filters are now passed to the hook
  const { data: transactionsData, isLoading } = useCompanyWalletTransactions({
    page: currentPage,
    per_page: perPage,
    type: typeFilter === "all" ? undefined : typeFilter,
    from_date: appliedFromDate || undefined,
    to_date: appliedToDate || undefined,
  });

  const transactions: CompanyWalletTransaction[] = transactionsData?.data ?? [];
  const pagination = transactionsData?.pagination;

  const handleTypeFilter = (type: TransactionType) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleDateFilter = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setFromDate("");
    setToDate("");
    setAppliedFromDate("");
    setAppliedToDate("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    typeFilter !== "all" || !!appliedFromDate || !!appliedToDate;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-lg sm:text-[20px] leading-[120%] tracking-[-1%] text-[#131C20]">
          Recent Transactions
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3">
        {/* Row 1: Type Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-[#6B7280] shrink-0" />
          <span className="text-[14px] text-[#6B7280]">Type:</span>
          {(["all", "credit", "debit"] as TransactionType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeFilter(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${
                typeFilter === type
                  ? "bg-[#068847] text-white"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
              }`}
            >
              {type === "credit" && <ArrowDownCircle className="w-3.5 h-3.5" />}
              {type === "debit" && <ArrowUpCircle className="w-3.5 h-3.5" />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Row 2: Date Filter */}
        <div className="flex flex-row items-center gap-2">
          <span className="text-[#6B7280] text-[13px] shrink-0">From</span>
          <div className="w-[160px]">
            <DatePicker value={fromDate} onChange={(val) => setFromDate(val)} />
          </div>
          <span className="text-[#6B7280] text-[13px] shrink-0">to</span>
          <div className="w-[160px]">
            <DatePicker value={toDate} onChange={(val) => setToDate(val)} />
          </div>
          <button
            onClick={handleDateFilter}
            className="shrink-0 px-4 py-1.5 text-[13px] font-medium bg-[#068847] text-white rounded-lg hover:bg-[#057a3d] transition-colors"
          >
            Apply
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#DEE3E7] rounded-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12 text-[#6B7280] text-[14px]">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-[#6B7280] text-[14px]">
              No transactions found
            </div>
          ) : (
            <>
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="text-[#030712] bg-[#EBEDF066] border-b border-[#DEE3E7]">
                    <th className="text-left py-3 px-4 font-medium text-[13px] text-[#6B7280]">
                      Transaction ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[13px] text-[#6B7280]">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[13px] text-[#6B7280]">
                      Category & Description
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-[13px] text-[#6B7280]">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-[13px] text-[#6B7280]">
                      Balance After
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[13px] text-[#6B7280]">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-[13px] text-[#6B7280]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const isCredit = tx.type === "credit";
                    const status = (tx.status || "completed") as Status;

                    return (
                      <tr
                        key={tx.id}
                        className="border-b last:border-none border-[#F3F4F6] hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="font-mono text-[12px] text-[#4A5565] whitespace-nowrap">
                            {tx.transaction_id}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            {isCredit ? (
                              <ArrowDownCircle className="w-4 h-4 text-[#068847] shrink-0" />
                            ) : (
                              <ArrowUpCircle className="w-4 h-4 text-[#F14248] shrink-0" />
                            )}
                            <span
                              className={`font-medium text-[13px] capitalize ${
                                isCredit ? "text-[#068847]" : "text-[#F14248]"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 max-w-[220px]">
                          <p className="font-semibold text-[13px] text-[#030712] mb-0.5">
                            {categoryLabels[tx.category] || tx.category}
                          </p>
                          <p className="font-normal text-[12px] text-[#6B7280] line-clamp-2">
                            {tx.description}
                          </p>
                        </td>
                        <td
                          className={`py-4 px-4 text-right font-semibold text-[13px] whitespace-nowrap ${
                            isCredit ? "text-[#068847]" : "text-[#F14248]"
                          }`}
                        >
                          {isCredit ? "+" : "-"}৳
                          {Math.abs(tx.amount).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <p className="font-medium text-[13px] text-[#030712]">
                            ৳{tx.balance_after.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <p className="font-normal text-[13px] text-[#73808C]">
                            {format(new Date(tx.created_at), "dd MMM yyyy")}
                          </p>
                          <p className="font-normal text-[11px] text-[#9CA3AF]">
                            {format(new Date(tx.created_at), "hh:mm a")}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-[11px] whitespace-nowrap ${
                              statusConfig[status].style
                            }`}
                          >
                            {statusConfig[status].icon}
                            {statusConfig[status].label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {pagination && pagination.last_page > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-[#F3F4F6] bg-[#FAFAFA]">
                  <Pagination
                    page={currentPage}
                    perPage={perPage}
                    total={pagination.total}
                    dataLength={transactions.length}
                    onNext={() =>
                      setCurrentPage((p) =>
                        Math.min(p + 1, pagination.last_page)
                      )
                    }
                    onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}