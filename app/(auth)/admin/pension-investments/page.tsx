"use client";

import { useState } from "react";
import { TrendingUp, BarChart3, Plus } from "lucide-react";
import InvestmentsTab from "./InvestmentsTab";
import StatisticsTab from "./StatisticsTab";
import InvestmentModal from "./InvestmentModal";

const TABS = [
  { key: "investments", label: "Investments", icon: TrendingUp },
  { key: "statistics", label: "Statistics & Reports", icon: BarChart3 },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export default function PensionInvestmentsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("investments");
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      <div className="bg-white border-b border-[#e8e6e0] max-w-7xl mx-auto">
        <div className="container">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
                Pension Investments
              </p>
              <p className="text-sm text-[#4A5565] mt-1">
                Manage pension fund investments and profit distributions
              </p>
            </div>
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              New Investment
            </button>
          </div>
          <div className="flex items-center gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabKey)}
                className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === key
                    ? "text-[#068847] bg-[#f8faf7]"
                    : "text-[#6A7282] hover:text-[#030712] hover:bg-[#f5f4f0]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#068847] rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="py-6 max-w-7xl mx-auto">
        {activeTab === "investments" ? (
          <InvestmentsTab />
        ) : (
          <StatisticsTab />
        )}
      </div>

      {openModal && (
        <InvestmentModal
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
}
