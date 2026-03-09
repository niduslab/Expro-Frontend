"use client";
import { Calendar, Package, Plus, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import NewPackageModal from "./new-package-modal";
const plans = [
  { name: "Basic Pension", price: 300, members: 245, maturity: "৳50,000" },
  { name: "Standard Pension", price: 700, members: 480, maturity: "৳120,000" },
  { name: "Premium Pension", price: 1000, members: 290, maturity: "৳180,000" },
  { name: "Executive Pension", price: 700, members: 150, maturity: "৳275,000" },
];
function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[12px] px-4 py-2 bg-[#F3F4F6]">
      <div className="flex items-center gap-2 text-[#4A5565] text-[11px]">
        {icon}
        {label}
      </div>
      <p className="text-[14px] font-medium text-[#030712]">{value}</p>
    </div>
  );
}
export default function AdminPensionPackages() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Pension Packages
          </p>
          <p className="text-sm text-[#4A5565]">
            Manage pension schemes and enrollment packages
          </p>
        </div>

        <div className="flex justify-start sm:justify-end">
          <button
            onClick={() => {
              setOpenModal(true);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap"
          >
            <Plus className="h-5 w-5 shrink-0" />
            <span className="text-sm font-semibold">Add new Package</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className="w-full min-h-[265px] flex flex-col justify-between border border-[#E5E7EB] rounded-[12px] p-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#068847]" />
                </div>

                <div>
                  <p className="font-semibold text-[16px] text-[#030712]">
                    {plan.name}
                  </p>
                  <p className="text-[#068847] font-semibold text-[12px]">
                    ৳{plan.price}
                    <span className="text-[#4A5565] font-normal">/month</span>
                  </p>
                </div>
              </div>

              <span className="text-[12px] font-semibold text-[#29A36A] bg-[#DFF1E9] border border-[#A8DAC3] px-3 py-[2px] rounded-full">
                Running
              </span>
            </div>

            <div className="h-[1px] w-full bg-[#E5E7EB] my-4"></div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <Stat
                icon={<Users size={14} />}
                label="Enrolled Members"
                value={plan.members}
              />
              <Stat
                icon={<Calendar size={14} />}
                label="Duration"
                value="9 Years (100 inst.)"
              />
              <Stat
                icon={<TrendingUp size={14} />}
                label="Maturity"
                value={plan.maturity}
              />
              <Stat
                icon={<Package size={14} />}
                label="Commission"
                value="৳30/inst"
              />
            </div>
          </div>
        ))}
      </div>
      {openModal && <NewPackageModal setOpenModal={setOpenModal} />}
    </>
  );
}
