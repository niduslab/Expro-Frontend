"use client";

interface PensionInstallmentsTabProps {
  pensionInstallments: any[];
}

export default function PensionInstallmentsTab({ pensionInstallments }: PensionInstallmentsTabProps) {
  if (!pensionInstallments || pensionInstallments.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <h3 className="text-xl font-semibold text-[#030712] mb-6">Pension Installments</h3>
        <p className="text-center text-[#6B7280] py-8">No pension installments found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-xl font-semibold text-[#030712] mb-6">Pension Installments</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Installment #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Paid Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {pensionInstallments.map((installment: any) => (
              <tr key={installment.id} className="hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 text-sm text-[#030712]">{installment.installment_number}</td>
                <td className="px-4 py-3 text-sm text-[#030712]">
                  {new Date(installment.due_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-[#030712]">
                  ৳{parseFloat(installment.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-[#030712]">
                  {installment.paid_date ? new Date(installment.paid_date).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    installment.status === "paid"
                      ? "bg-[#CCFBF1] text-[#0D9488]"
                      : installment.status === "pending"
                      ? "bg-[#FEF3C7] text-[#92400E]"
                      : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}>
                    {installment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
