import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  SquareArrowRightExit,
} from "lucide-react";
import RecentTransactions from "./recent-transactions";
const stats = [
  {
    title: "Total Balance",
    value: "৳45.2L",
    description: "Current available balance",
    icon: Wallet,
    color: "text-[#03B65C]",
  },
  {
    title: "Commission Pool",
    value: "৳18.5L",
    description: "Pending distributions",
    icon: TrendingUp,
    color: "text-[#03B65C]",
  },
  {
    title: "Total Deposited",
    value: "৳128.0L",
    description: "All-time inflow",
    icon: ArrowUpRight,
    color: "text-[#03B65C]",
  },
  {
    title: "Total Withdrawn",
    value: "৳82.8L",
    description: "All-time outflow",
    icon: SquareArrowRightExit,
    color: "text-[#F14248]",
  },
];
const WalletBallance = () => {
  return (
    <>
      <div className="w-[1133px] flex flex-col   gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Wallet Balance
          </p>
          <p className="text-sm text-[#4A5565]">
            Financial overview & transaction history
          </p>
        </div>

        <div className=" w-[1132px] h-[137px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] overflow-hidden">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="bg-white p-6 w-[271px] mb-10 rounded-xl shadow-sm border border-[#F3F4F6]"
                >
                  <div className="flex w-[172px] items-center justify-between">
                    <div className="px-3 py-2 w-[48px] h-[48px] flex items-center bg-[#F3F4F6] rounded-lg">
                      <Icon className="text-[#068847]" />
                    </div>

                    <div>
                      <p className="text-[12px] text-[#4A5565]">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-[#030712] mt-2">
                        {stat.value}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 w-[239px] border border-dashed border-[#E5E7EB]" />

                  <div className="mt-4 flex items-center text-sm">
                    <span className={`${stat.color} ml-1`}>
                      {stat.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[1132px]  pt-12">
          <RecentTransactions />
        </div>
      </div>
    </>
  );
};

export default WalletBallance;
