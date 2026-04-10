"use client";

import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, ArrowUpCircle, ArrowDownCircle, ChevronLeft, ChevronRight, Filter, Calendar, Wallet } from "lucide-react";
import { useCompanyWalletTransactions } from "@/lib/hooks";
import { format } from "date-fns";

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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const perPage = 10;

  const { data: transactionsData, isLoading } = useCompanyWalletTransactions({
    page: currentPage,
    per_page: perPage,
    type: typeFilter === "all" ? undefined : typeFilter,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
  });

  const transactions = transactionsData?.data || [];
  const pagination = transactionsData?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTypeFilter = (type: TransactionType) => {
    setTypeFilter(type);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDateFilter = () => {
    setCurrentPage(1); // Reset to first page when date filter is applied
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-[20px] leading-[120%] tracking-[-1%] align-middle text-[#131C20]">
          Recent Transactions
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Transaction Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#6B7280]" />
          <span className="text-[14px] text-[#6B7280] mr-2">Type:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleTypeFilter("all")}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                typeFilter === "all"
                  ? "bg-[#068847] text-white"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleTypeFilter("credit")}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors flex items-center gap-2 ${
                typeFilter === "credit"
                  ? "bg-[#068847] text-white"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              Credit
            </button>
            <button
              onClick={() => handleTypeFilter("debit")}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors flex items-center gap-2 ${
                typeFilter === "debit"
                  ? "bg-[#068847] text-white"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              Debit
            </button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-[#6B7280]" />
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 text-[14px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              placeholder="From"
            />
            <span className="text-[#6B7280]">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 text-[14px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              placeholder="To"
            />
            <button
              onClick={handleDateFilter}
              className="px-4 py-2 text-[14px] font-medium bg-[#068847] text-white rounded-lg hover:bg-[#057a3d] transition-colors"
            >
              Apply
            </button>
            {(typeFilter !== "all" || fromDate || toDate) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-[14px] font-medium text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border border-[#DEE3E7] rounded-2xl overflow-hidden min-w-0">
        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          ) : (
            <>
              <table className="w-full min-w-max">
                <thead>
                  <tr className="text-[#030712] bg-[#EBEDF066] border-b relative border-[#DEE3E7] rounded-4xl">
                    <th className="text-left py-3 px-4 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                      Transaction ID
                    </th>
                    <th className="text-left py-3 px-4 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                      Category & Description
                    </th>
                    <th className="text-right py-3 px-4 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                      Balance After
                    </th>
                    <th className="text-left py-3 px-4 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
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
                        className="rounded-2xl relative border-b last:border-none border-[#F3F4F6] hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <p className="font-mono text-[12px] text-[#4A5565]">
                            {tx.transaction_id}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {isCredit ? (
                              <ArrowDownCircle className="w-4 h-4 text-[#068847]" />
                            ) : (
                              <ArrowUpCircle className="w-4 h-4 text-[#F14248]" />
                            )}
                            <span
                              className={`font-medium text-[14px] capitalize ${
                                isCredit ? "text-[#068847]" : "text-[#F14248]"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 max-w-md">
                          <p className="font-semibold text-[14px] text-[#030712] mb-1">
                            {categoryLabels[tx.category] || tx.category}
                          </p>
                          <p className="font-normal text-[13px] text-[#6B7280] line-clamp-2">
                            {tx.description}
                          </p>
                        </td>
                        <td
                          className={`py-4 px-4 text-right font-semibold text-[14px] ${
                            isCredit ? "text-[#068847]" : "text-[#F14248]"
                          }`}
                        >
                          {isCredit ? "+" : "-"}৳
                          {Math.abs(tx.amount).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-medium text-[14px] text-[#030712]">
                            ৳{tx.balance_after.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-normal text-[14px] text-[#73808C]">
                            {format(new Date(tx.created_at), "dd MMM yyyy")}
                          </p>
                          <p className="font-normal text-[12px] text-[#9CA3AF]">
                            {format(new Date(tx.created_at), "hh:mm a")}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium text-[12px] leading-[150%] tracking-[-1%] ${
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

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#F3F4F6] bg-[#FAFAFA]">
                  <div className="text-[14px] text-[#6B7280]">
                    Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{" "}
                    {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{" "}
                    {pagination.total} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-[#068847] text-white"
                                : "text-[#6B7280] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB]"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.last_page}
                      className="inline-flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
