"use client";

type TabType = 'profile' | 'pension_enrollments' | 'pension_installments' | 'wallet' | 'wallet_transactions' | 'nominees';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  counts: {
    pensionEnrollments: number;
    pensionInstallments: number;
    walletTransactions: number;
    nominees: number;
  };
}

export default function TabNavigation({ activeTab, setActiveTab, counts }: TabNavigationProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-2">
      <div className="flex flex-wrap gap-2">
        <TabButton
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          label="Profile"
        />
        <TabButton
          active={activeTab === 'pension_enrollments'}
          onClick={() => setActiveTab('pension_enrollments')}
          label="Pension Enrollments"
          count={counts.pensionEnrollments}
        />
        <TabButton
          active={activeTab === 'pension_installments'}
          onClick={() => setActiveTab('pension_installments')}
          label="Pension Installments"
          count={counts.pensionInstallments}
        />
        <TabButton
          active={activeTab === 'wallet'}
          onClick={() => setActiveTab('wallet')}
          label="Wallet"
        />
        <TabButton
          active={activeTab === 'wallet_transactions'}
          onClick={() => setActiveTab('wallet_transactions')}
          label="Transactions"
          count={counts.walletTransactions}
        />
        <TabButton
          active={activeTab === 'nominees'}
          onClick={() => setActiveTab('nominees')}
          label="Nominees"
          count={counts.nominees}
        />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-[#068847] text-white"
          : "bg-white text-[#4A5565] hover:bg-[#F3F4F6]"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
          active ? "bg-white/20" : "bg-[#E5E7EB]"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}
