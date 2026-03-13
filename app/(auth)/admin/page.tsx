"use client";

import React from "react";

import RecentActivity from "./dashboard/recentActivity";
import CommissionOverview from "./dashboard/commission/page";
import MemberApproval from "./dashboard/memberApproval";
import StatsCard from "./dashboard/statsCard";
import ChartSection from "./dashboard/chartSection";
import PackageDistribution from "./dashboard/chartDistribution";

export default function AdminDashboard() {
  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col  gap-6">
        <div>
          <h1 className="text-3xl  text-[#030712]  font-semibold leading-[120%] tracking-[-0.01em]">
            Dashboard
          </h1>
          <p className="text-[#4A5565] mt-1 font-normal text-sm leading-[150%] tracking-[-0.01em]">
            Welcome back! Here's what's happening at Expro Welfare Foundation
            today.
          </p>
        </div>
        <div>
          <StatsCard />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
          <ChartSection />
          <PackageDistribution />
        </div>

        <div className="overflow-x-auto w-full pb-2">
          <MemberApproval />
        </div>
        <div>
          <CommissionOverview />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
