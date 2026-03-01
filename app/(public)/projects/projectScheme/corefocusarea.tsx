export default function CoreFocusArea() {
  return (
    <>
      <div className="h-[654px] px-[64px] py-[64px] gap-[10px] flex flex-col items-center justify-center">
        <div className="inline-flex items-center w-[170px] gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
          Core Focus Areas
        </div>

        <h2 className="text-5xl md:text-5xl lg:text-[48px] font-bold text-gray-900 leading-[1.2]">
          Key Pillars of the Project
        </h2>
        <div className="bg-[#F9FAFB] h-[248px] gap-[10px] p-[24px] rounded-[8px] grid grid-cols-4">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center justify-center h-[56px] w-[56px] rounded-[6px] bg-[#068847]">
              <p className="font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em] text-white">
                01
              </p>
            </div>
            <div className="h-[99px] space-y-3">
              <p className="text-[#030712] font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em]">
                Lifetime Security
              </p>
              <p className="font-dmSans font-normal text-[14px] leading-[1.5] tracking-[-0.01em] text-[#4A5565]">
                Upon completing the 100-month tenure, receive a guaranteed lump
                sum and start receiving a monthly pension for life.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center justify-center h-[56px] w-[56px] rounded-[6px] bg-[#068847]">
              <p className="font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em] text-white">
                02
              </p>
            </div>
            <div className="h-[99px] space-y-3">
              <p className="text-[#030712] font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em]">
                Profit-Based Returns
              </p>
              <p className="font-dmSans font-normal text-[14px] leading-[1.5] tracking-[-0.01em] text-[#4A5565]">
                Your pension is backed by real-world investments. We share 30%
                of profits from invested projects directly with pension holders.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center justify-center h-[56px] w-[56px] rounded-[6px] bg-[#068847]">
              <p className="font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em] text-white">
                03
              </p>
            </div>
            <div className="h-[99px] space-y-3">
              <p className="text-[#030712] font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em]">
                Locked-in Savings
              </p>
              <p className="font-dmSans font-normal text-[14px] leading-[1.5] tracking-[-0.01em] text-[#4A5565]">
                Withdrawals are not permitted until the full 100-month term is
                completed, guaranteeing a significant fund for your future.
              </p>
            </div>
          </div>{" "}
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center justify-center h-[56px] w-[56px] rounded-[6px] bg-[#068847]">
              <p className="font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em] text-white">
                04
              </p>
            </div>
            <div className="h-[99px] space-y-3">
              <p className="text-[#030712] font-dmSans font-semibold text-[20px] leading-[1.2] tracking-[-0.01em]">
                Membership Exclusive
              </p>
              <p className="font-dmSans font-normal text-[14px] leading-[1.5] tracking-[-0.01em] text-[#4A5565]">
                This unique opportunity is exclusively available to registered
                members of the Expro Welfare Foundation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
