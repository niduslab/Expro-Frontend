"use client";

import { Download } from "lucide-react";
import {
  downloadInvoice,
  formatBdt as formatAmount,
  titleCase as formatType,
  formatDateTime as formatDate,
} from "@/lib/utils/invoice";

interface PaymentsTabProps {
  payments: any[];
  memberProfile?: any;
  memberEmail?: string;
}

const statusStyle = (status: string) => {
  const s = String(status || "").toLowerCase();
  if (s === "completed" || s === "success" || s === "paid")
    return "bg-[#CCFBF1] text-[#0D9488]";
  if (s === "pending") return "bg-[#FEF3C7] text-[#92400E]";
  return "bg-[#FEE2E2] text-[#991B1B]";
};

export default function PaymentsTab({ payments, memberProfile, memberEmail }: PaymentsTabProps) {
  const handleDownloadInvoice = (payment: any) => {
    const paidAt = formatDate(payment.paid_at || payment.collected_at || payment.created_at);
    downloadInvoice({
      title: "PAYMENT INVOICE",
      invoiceNo: payment.payment_id || `PAY-${payment.id}`,
      paidAt,
      member: {
        name: memberProfile?.name_english,
        memberId: memberProfile?.member_id,
        mobile: memberProfile?.mobile,
        email: memberEmail,
      },
      rows: [
        ["Payment Type", formatType(payment.payment_type)],
        ["Payment Method", formatType(payment.payment_method) || "—"],
        ["Gateway Txn ID", payment.gateway_transaction_id || "—"],
        ["Status", formatType(payment.status)],
        ["Paid At", paidAt],
      ],
      amount: formatAmount(payment.amount),
      charges: formatAmount(payment.total_charges),
      total: formatAmount(payment.net_amount ?? payment.amount),
    });
  };

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <h3 className="text-xl font-semibold text-[#030712] mb-6">Payments</h3>
        <p className="text-center text-[#6B7280] py-8">No payments found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-xl font-semibold text-[#030712] mb-6">Payments</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Payment ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Method</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {payments.map((payment: any) => (
              <tr key={payment.id} className="hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 text-sm font-mono text-[#030712]">
                  {payment.payment_id || `PAY-${payment.id}`}
                </td>
                <td className="px-4 py-3 text-sm text-[#030712]">{formatType(payment.payment_type)}</td>
                <td className="px-4 py-3 text-sm text-[#030712]">{formatType(payment.payment_method) || "—"}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#030712]">{formatAmount(payment.amount)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(payment.status)}`}>
                    {formatType(payment.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#030712]">
                  {formatDate(payment.paid_at || payment.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDownloadInvoice(payment)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#068847] text-[#068847] text-xs font-medium hover:bg-[#068847] hover:text-white transition-colors"
                    title="Download invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
