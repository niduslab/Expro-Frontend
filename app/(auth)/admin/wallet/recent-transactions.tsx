"use client";

import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useCompanyWalletTransactions } from "@/lib/hooks";
import { format } from "date-fns";

type Status = "Approved" | "Pending" | "Rejected";

export const statusConfig: Record<
  Status,
  { style: string; icon: React.ReactNode }
> = {
  Approved: {
    style: "bg-[#29A36A26] border border-[#29A36A4D] text-[#29A36A]",
    icon: <CheckCircle size={14} />,
  },
  Pending: {
    style: "bg-[#FEF1DA] border border-[#FBD89C] text-[#F59F0A]",
    icon: <Clock size={14} />,
  },
  Rejected: {
    style: "bg-[#DC282826] border border-[#DC28284D] text-[#DC2828]",
    icon: <XCircle size={14} />,
  },
};

export default function RecentTransactions() {
  const { data: transactionsData, isLoading } = useCompanyWalletTransactions({
    page: 1,
    per_page: 10,
  });

  const transactions = transactionsData?.data || [];

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 ">
      <h2 className="pb-5 font-semibold text-[20px] leading-[120%] tracking-[-1%] align-middle text-[#131C20]">
        Recent Transactions
      </h2>

      <div className="border border-[#DEE3E7]  rounded-2xl overflow-hidden min-w-0">
        <div className="w-full overflow-x-auto ">
          {isLoading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No transactions found</div>
          ) : (
            <table className="w-full min-w-max">
              <thead>
                <tr className="text-[#030712] bg-[#EBEDF066]  border-b relative  border-[#DEE3E7] rounded-4xl ">
                  <th className="text-left py-3 px-2 font-normal text-[14px]  leading-[150%] tracking-[-1%] align-middle">
                    Category Name
                  </th>
                  <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                    User Name
                  </th>
                  <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                    Amount
                  </th>
                  <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => {
                  const isCredit = tx.type === "credit";
                  const status: Status = "Approved"; // Default status, adjust based on your API response
                  
                  return (
                    <tr
                      key={tx.id}
                      className=" rounded-2xl relative   border-b last:border-none border-[#F3F4F6] hover:bg-gray-50"
                    >
                      <td className="py-4 px-2 ">
                        <p className="font-medium text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#030712]">
                          {tx.category}
                        </p>
                      </td>
                      <td className="py-4 px-2">
                        <p className="font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#4A5565]">
                          {tx.user_name || "N/A"}
                        </p>
                      </td>

                      <td
                        className={`py-4 px-2 font-normal text-[14px] leading-[20px] tracking-0 align-middle ${
                          isCredit ? "text-[#068847]" : "text-[#F14248]"
                        }`}
                      >
                        {isCredit ? "+" : "-"}৳
                        {Math.abs(tx.amount).toLocaleString()}
                      </td>

                      <td className="py-4 px-2 ">
                        <p className="font-normal text-[14px] leading-[20px] tracking-0 align-middle text-[#73808C]">
                          {format(new Date(tx.created_at), "dd MMM yyyy")}
                        </p>
                      </td>

                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium text-[12px] leading-[150%] tracking-[-1%] ${statusConfig[status].style}`}
                        >
                          {statusConfig[status].icon}
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
