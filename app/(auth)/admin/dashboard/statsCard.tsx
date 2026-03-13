import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  SquareArrowRightExit,
  Users,
  FolderKanban,
  ArrowUp,
} from "lucide-react";
const stats = [
  {
    title: "Total Members",
    value: "1845",
    description: "12% from last month",
    icon: Users,
    subicon: ArrowUp,
    color: "text-[#03B65C]",
  },
  {
    title: "Active Projects",
    value: "06",
    description: "2% new this quarter",
    icon: FolderKanban,
    subicon: ArrowUp,
    color: "text-[#03B65C]",
  },
  {
    title: "Total Collections",
    value: "৳24.5L",
    description: "12% from last month",
    icon: TrendingUp,
    subicon: ArrowUp,
    color: "text-[#03B65C]",
  },
  {
    title: "Wallet Balance",
    value: "৳8,42,000",
    description: "৳ 1.2L pending",
    icon: SquareArrowRightExit,
    color: "text-[#03B65C]",
  },
];
export default function StatsCard() {
  return (
    <>
      <div className="w-full px">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const SubIcon = stat.subicon || (() => null);
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

                <div className="mt-3 sm:mt-4 text-sm  ">
                  <span className={`${stat.color} flex items-center `}>
                    {stat.subicon && (
                      <>
                        <SubIcon className="text-[#068847] w-4 h-5" />
                      </>
                    )}
                    {stat.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
