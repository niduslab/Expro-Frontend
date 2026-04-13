"use client";

interface WalletTabProps {
  wallet: any;
}

export default function WalletTab({ wallet }: WalletTabProps) {
  if (!wallet) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <h3 className="text-xl font-semibold text-[#030712] mb-6">Wallet Details</h3>
        <p className="text-center text-[#6B7280] py-8">No wallet information found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
      <h3 className="text-xl font-semibold text-[#030712] mb-6">Wallet Details</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-[#068847] to-[#045a2e] rounded-lg text-white">
            <p className="text-sm text-white/70 mb-1">Current Balance</p>
            <p className="text-3xl font-bold">৳{parseFloat(wallet.balance).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Commission Balance</p>
            <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.commission_balance).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_commission_earned).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Total Deposited</p>
            <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_deposited).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Total Withdrawn</p>
            <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_withdrawn).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Membership Paid</p>
            <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_membership_paid).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Pension Paid</p>
            <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_pension_paid).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-1">Status</p>
            <p className="text-lg font-bold">
              <span className={`px-3 py-1 rounded-full text-sm ${
                wallet.is_locked ? "bg-[#FEE2E2] text-[#991B1B]" : "bg-[#CCFBF1] text-[#0D9488]"
              }`}>
                {wallet.is_locked ? "Locked" : "Active"}
              </span>
            </p>
          </div>
        </div>
        {wallet.is_locked && (
          <div className="p-4 bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg">
            <p className="text-sm font-medium text-[#991B1B]">Wallet is currently locked</p>
          </div>
        )}
      </div>
    </div>
  );
}
