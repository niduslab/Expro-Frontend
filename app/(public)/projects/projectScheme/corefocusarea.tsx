export default function CoreFocusArea() {
  return (
    <section className="font-dm-sans w-full px-4 sm:px-6 lg:px-[64px] py-16 lg:py-[64px] flex flex-col items-center gap-12">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="inline-flex items-center w-fit gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
          Core Focus Areas
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-gray-900 leading-tight">
          Key Pillars of the Project
        </h2>
      </div>

      {/* Cards */}
      <div className="bg-[#F9FAFB] w-full p-6 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            no: "01",
            title: "Lifetime Security",
            desc: "Upon completing the 100-month tenure, receive a guaranteed lump sum and start receiving a monthly pension for life.",
          },
          {
            no: "02",
            title: "Profit-Based Returns",
            desc: "Your pension is backed by real-world investments. We share 30% of profits from invested projects directly with pension holders.",
          },
          {
            no: "03",
            title: "Locked-in Savings",
            desc: "Withdrawals are not permitted until the full 100-month term is completed, guaranteeing a significant fund for your future.",
          },
          {
            no: "04",
            title: "Membership Exclusive",
            desc: "This unique opportunity is exclusively available to registered members of the Expro Welfare Foundation.",
          },
        ].map((item) => (
          <div key={item.no} className="flex flex-col gap-6">
            <div className="flex items-center justify-center h-14 w-14 rounded-md bg-[#068847]">
              <p className="text-white font-semibold text-[20px]">{item.no}</p>
            </div>

            <div className="space-y-3">
              <p className="text-[#030712] font-semibold text-[20px]">
                {item.title}
              </p>
              <p className="text-[#4A5565] text-[15px] sm:text-[17px] leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
