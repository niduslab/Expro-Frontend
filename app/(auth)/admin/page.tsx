"use client";

import React from "react";

import RecentActivity from "./recentActivity";
import CommissionOverview from "./commission/page";
import MemberApproval from "./memberApproval";
import StatsCard from "./statsCard";
import ChartSection from "./chartSection";

export default function AdminDashboard() {
  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col  gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening at Expro Welfare Foundation
            today.
          </p>
        </div>
        <div>
          <StatsCard />
        </div>
        <div>
          <ChartSection />
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
