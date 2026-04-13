"use client";

interface WalletTransactionsTabProps {
  walletTransactions: any[];
}

export default function WalletTransactionsTab({ walletTransactions }: WalletTransactionsTabProps) {
  if (!walletTransactions || walletTransactions.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <h3 className="text-xl font-semibold text-[#030712] mb-6">Wallet Transactions</h3>
        <p className="text-center text-[#6B7280] py-8">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-xl font-semibold text-[#030712] mb-6">Wallet Transactions</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Transaction ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Balance After</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {walletTransactions.map((transaction: any) => (
              <tr key={transaction.id} className="hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 text-sm font-mono text-[#030712]">{transaction.transaction_id}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.type === "credit"
                      ? "bg-[#CCFBF1] text-[#0D9488]"
                      : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#030712] capitalize">{transaction.category.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#030712]">
                  ৳{parseFloat(transaction.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-[#030712]">
                  ৳{parseFloat(transaction.balance_after).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === "completed"
                      ? "bg-[#CCFBF1] text-[#0D9488]"
                      : transaction.status === "pending"
                      ? "bg-[#FEF3C7] text-[#92400E]"
                      : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#030712]">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
