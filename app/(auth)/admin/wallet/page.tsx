import {
  Users,
  FolderKanban,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  SquareArrowRightExit,
} from "lucide-react";
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

        <div className="w-full h-[137px] gap-[16px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Balance */}
            <div className="bg-white p-6 w-[271px] rounded-xl shadow-sm border border-gray-100">
              <div className="flex w-[172px] items-center justify-between ">
                <div className="px-3 py-2 w-[48px] flex items-center h-[48px] bg-[#F3F4F6] rounded-lg">
                  <Wallet className=" text-[#068847]" />
                </div>
                <div>
                  <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
                    Total Balance
                  </p>
                  <h3 className="text-2xl font-bold text-[#030712] mt-2">
                    ৳45.2L
                  </h3>
                </div>
              </div>
              <div className=" mt-4 w-[239px] border border-dashed border-[#E5E7EB]"></div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-[#03B65C] ml-1">
                  Current available balance
                </span>
              </div>
            </div>

            {/* Commission Pool */}
            <div className="bg-white p-6 w-[271px] rounded-xl shadow-sm border border-gray-100">
              <div className="flex w-[172px] items-center justify-between ">
                <div className="px-3 py-2 w-[48px] flex items-center h-[48px] bg-[#F3F4F6] rounded-lg">
                  <TrendingUp className=" text-[#068847]" />
                </div>
                <div>
                  <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
                    Commission Pool
                  </p>
                  <h3 className="text-2xl font-bold text-[#030712] mt-2">
                    ৳18.5L
                  </h3>
                </div>
              </div>
              <div className=" mt-4 w-[239px] border border-dashed border-[#E5E7EB]"></div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-[#03B65C] ml-1">
                  Pending distributions
                </span>
              </div>
            </div>
            {/* Total Deposited */}
            <div className="bg-white p-6 w-[271px] rounded-xl shadow-sm border border-gray-100">
              <div className="flex w-[172px] items-center justify-between ">
                <div className="px-3 py-2 w-[48px] flex items-center h-[48px] bg-[#F3F4F6] rounded-lg">
                  <ArrowUpRight className=" text-[#068847]" />
                </div>
                <div>
                  <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
                    Total Deposited
                  </p>
                  <h3 className="text-2xl font-bold text-[#030712] mt-2">
                    ৳128.0L
                  </h3>
                </div>
              </div>
              <div className=" mt-4 w-[239px] border border-dashed border-[#E5E7EB]"></div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-[#03B65C] ml-1">All-time inflow</span>
              </div>
            </div>
            {/* Total withdrawn */}
            <div className="bg-white p-6 w-[271px] rounded-xl shadow-sm border border-gray-100">
              <div className="flex w-[172px] items-center justify-between ">
                <div className="px-3 py-2 w-[48px] flex items-center h-[48px] bg-[#F3F4F6] rounded-lg">
                  <SquareArrowRightExit className=" text-[#068847]" />
                </div>
                <div>
                  <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
                    Total Withdrawn
                  </p>
                  <h3 className="text-2xl font-bold text-[#030712] mt-2">
                    ৳82.8L
                  </h3>
                </div>
              </div>
              <div className=" mt-4 w-[239px] border border-dashed border-[#E5E7EB]"></div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-[#F14248] ml-1">All-time outflow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletBallance;
