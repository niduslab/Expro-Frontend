"use client";

import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  SquareArrowRightExit,
} from "lucide-react";
import RecentTransactions from "./recent-transactions";
import { useCompanyWalletDashboard } from "@/lib/hooks";

const WalletBallance = () => {
  const { data: dashboardData, isLoading } = useCompanyWalletDashboard();

  const stats = [
    {
      title: "Total Balance",
      value: dashboardData?.total_balance 
        ? `৳${(dashboardData.total_balance / 100000).toFixed(1)}L` 
        : "৳0.0L",
      description: "Current available balance",
      icon: Wallet,
      color: "text-[#03B65C]",
    },
    {
      title: "Commission Pool",
      value: dashboardData?.commission_pool 
        ? `৳${(dashboardData.commission_pool / 100000).toFixed(1)}L` 
        : "৳0.0L",
      description: "Pending distributions",
      icon: TrendingUp,
      color: "text-[#03B65C]",
    },
    {
      title: "Total Deposited",
      value: dashboardData?.total_deposited 
        ? `৳${(dashboardData.total_deposited / 100000).toFixed(1)}L` 
        : "৳0.0L",
      description: "All-time inflow",
      icon: ArrowUpRight,
      color: "text-[#03B65C]",
    },
    {
      title: "Total Withdrawn",
      value: dashboardData?.total_withdrawn 
        ? `৳${(dashboardData.total_withdrawn / 100000).toFixed(1)}L` 
        : "৳0.0L",
      description: "All-time outflow",
      icon: SquareArrowRightExit,
      color: "text-[#F14248]",
    },
  ];

  return (
    <>
      <div className="max-w-7xl  mx-auto ">
        <div className="flex flex-col gap-6 ">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#030712]">
              Wallet Balance
            </p>
            <p className="text-sm sm:text-base text-[#4A5565]">
              Financial overview & transaction history
            </p>
          </div>
          {/* Stats Cards */}
          <div className="w-full max-w-7xl mx-auto">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-[#F3F4F6] flex flex-col items-center sm:items-start"
                    >
                      <div className="w-full flex items-center  gap-5 sm:gap-6 px-6 sm:px-0 sm:justify-start">
                        <div className="w-12 h-12 flex items-center justify-center bg-[#F3F4F6] rounded-lg ">
                          <Icon className="text-[#068847] w-6 h-6" />
                        </div>
                        <div className="">
                          <p className="text-xs sm:text-sm text-[#4A5565]">
                            {stat.title}
                          </p>
                          <h3 className="text-xl sm:text-2xl font-bold text-[#030712] mt-1 sm:mt-2 ">
                            {stat.value}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4 w-full border border-dashed border-[#E5E7EB]" />

                      <div className="mt-3 sm:mt-4 text-sm ">
                        <span className={`${stat.color} `}>
                          {stat.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-[400px] md:w-full  pt-8 sm:pt-12">
            <RecentTransactions />
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletBallance;
