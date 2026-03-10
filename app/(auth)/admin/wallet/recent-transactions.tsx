"use client";

import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";

type Status = "Approved" | "Pending" | "Rejected";

interface Transaction {
  id: number;
  category: string;
  user: string;
  amount: number;
  date: string;
  status: Status;
}

const transactions: Transaction[] = [
  {
    id: 1,
    category: "Pension Installment",
    user: "Fatema Begum",
    amount: 1000,
    date: "14 Feb 2026",
    status: "Pending",
  },
  {
    id: 2,
    category: "Joining Fee",
    user: "Md. Rahim",
    amount: 400,
    date: "13 Feb 2026",
    status: "Approved",
  },
  {
    id: 3,
    category: "Commission Payout",
    user: "Kamal Hossain (PP)",
    amount: -12500,
    date: "12 Feb 2026",
    status: "Pending",
  },
  {
    id: 4,
    category: "Pension Installment",
    user: "Nasreen Akter",
    amount: 700,
    date: "11 Feb 2026",
    status: "Approved",
  },
  {
    id: 5,
    category: "Withdrawal to bKash",
    user: "Jamal Ahmed (EM)",
    amount: -25000,
    date: "09 Feb 2026",
    status: "Rejected",
  },
  {
    id: 6,
    category: "Executive Joining",
    user: "Shafiq Islam",
    amount: 60000,
    date: "11 Feb 2026",
    status: "Approved",
  },
  {
    id: 7,
    category: "Pension Installment",
    user: "Multiple Members",
    amount: 700,
    date: "11 Feb 2026",
    status: "Approved",
  },
];

const statusConfig: Record<Status, { style: string; icon: React.ReactNode }> = {
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
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 ">
      <h2 className="pb-5 font-semibold text-[20px] leading-[120%] tracking-[-1%] align-middle text-[#131C20]">
        Recent Transactions
      </h2>

      <div className="border border-[#DEE3E7]  rounded-2xl overflow-hidden min-w-0">
        <div className="w-full overflow-x-auto ">
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
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className=" rounded-2xl relative   border-b last:border-none border-[] hover:bg-gray-50"
                >
                  <td className="py-4 px-2 ">
                    <p className="font-medium text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#030712]">
                      {tx.category}
                    </p>
                  </td>
                  <td className="py-4 px-2">
                    <p className="font-normal text-[14px] leading-[150%] tracking-[-1%] align-middle text-[#4A5565]">
                      {" "}
                      {tx.user}
                    </p>
                  </td>

                  <td
                    className={`py-4 px-2 font-normal text-[14px] leading-[20px] tracking-0 align-middle ${
                      tx.amount > 0 ? "text-[#068847]" : "text-[#F14248]"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "-"}৳
                    {Math.abs(tx.amount).toLocaleString()}
                  </td>

                  <td className="py-4 px-2 ">
                    {" "}
                    <p className="font-normal text-[14px] leading-[20px] tracking-0 align-middle text-[#73808C]">
                      {tx.date}
                    </p>
                  </td>

                  <td className="py-4 px-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium text-[12px] leading-[150%] tracking-[-1%] ${statusConfig[tx.status].style}`}
                    >
                      {statusConfig[tx.status].icon}
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
