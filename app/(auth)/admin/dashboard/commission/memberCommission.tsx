import { Users } from "lucide-react";

export default function MemberCommissionCard() {
  const data = [
    {
      role: "EM (Executive Member)",
      rate: "৳200/member",
      members: 27,
      earned: "৳5,400",
    },
    {
      role: "EM (Executive Member)",
      rate: "৳150/member",
      members: 29,
      earned: "৳5,400",
    },
    {
      role: "APP (Associate PP)",
      rate: "৳100/member",
      members: 30,
      earned: "৳5,400",
    },
  ];

  return (
    <div className="w-full   rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#F3F4F6] rounded-lg">
          <Users className="text-[#068847]" size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-[16px] leading-[150%] tracking-[-0.01em] align-middle text-[#030712]">
            New Member Commission
          </h2>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle text-[#4A5565]">
            One-time referral bonus per new enrollment
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#F3F4F6] border border-[#F3F4F6] rounded-xl p-3 flex flex-col gap-2">
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            This Month
          </p>
          <p className="font-semibold text-[20px] leading-[120%] tracking-[-0.01em] text-[#030712]">
            ৳12,750
          </p>
          <p className="font-normal text-[14px] leading-[150%] tracking-[-0.01em] text-[#068847]">
            +30% vs last month
          </p>
        </div>

        <div className="bg-[#F3F4F6]  border border-[#F3F4F6] rounded-xl p-3 flex flex-col gap-2">
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            All Time
          </p>
          <p className="font-semibold text-[20px] leading-[120%] tracking-[-0.01em] text-[#030712]">
            ৳48,500
          </p>
          <p className="font-normal text-[14px] leading-[150%] tracking-[-0.01em] text-[#068847]">
            Since inception
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#F3F4F6] rounded-xl">
        {" "}
        <table className="w-full ">
          <thead className=" bg-[#EBEDF066] text-[#4A5565] font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Rate</th>
              <th className="text-left px-4 py-3 font-medium">Members</th>
              <th className="text-right px-4 py-3 font-medium">Earned</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-t  border-gray-200">
                <td className="px-4 py-3 font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle text-[#030712]">
                  {item.role}
                </td>
                <td className="px-4 py-3 text-[#4A5565] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                  {item.rate}
                </td>
                <td className="px-4 py-3 text-[#4A5565] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                  {item.members}
                </td>
                <td className="px-4 py-3 font-medium text-[12px] leading-[150%] tracking-[-0.01em] text-right text-[#030712]">
                  {item.earned}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
