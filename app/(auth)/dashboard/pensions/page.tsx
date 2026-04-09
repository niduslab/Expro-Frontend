"use client";

import { useState } from "react";
import { Package, Receipt } from "lucide-react";
import { PensionPageProps, Tab } from "./types";
import EnrollmentsTab from "./EnrollmentsTab";
import InstallmentsTab from "./InstallmentsTab";

export default function PensionPage({
  enrollments = [],
  installments = [],
  enrollmentNumbers,
}: PensionPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("enrollments");

  const tabs: {
    key: Tab;
    label: string;
    icon: React.ElementType;
    count: number;
  }[] = [
    {
      key: "enrollments",
      label: "Enrollments",
      icon: Package,
      count: enrollments.length,
    },
    {
      key: "installments",
      label: "Installments",
      icon: Receipt,
      count: installments.length,
    },
  ];

  return (
    <div className="container mx-auto mb-4">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Title */}
        <div>
          <h1 className="text-lg font-semibold text-[#030712]">
            Pension Plans
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Your enrolled pension packages and payment history
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
          {tabs.map(({ key, label, icon: Icon, count }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-[#030712] shadow-sm"
                      : "text-[#6B7280] hover:text-[#030712]"
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-[#068847]" : ""}`}
                />
                {label}
                <span
                  className={`
                    text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                    ${
                      isActive
                        ? "bg-[#F0FDF4] text-[#068847]"
                        : "bg-[#E5E7EB] text-[#9CA3AF]"
                    }
                  `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "enrollments" ? (
          <EnrollmentsTab enrollments={enrollments} />
        ) : (
          <InstallmentsTab
            installments={installments}
            enrollmentNumbers={enrollmentNumbers}
          />
        )}
      </div>
    </div>
  );
}
