"use client";

import { ArrowUpRight } from "lucide-react";

interface Activity {
  id: number;
  title: string;
  name: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: "New Member Commission",
    name: "Md. Rahim Uddin",
    description: " — 700 BDT Package — Health Initiative",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Installment paid",
    name: "Fatema Begum ",
    description: "— ৳1,000 — Installment #14",
    time: "18 min ago",
  },
  {
    id: 3,
    title: "Commission credited",
    name: "Kamal Hossain ",
    description: "— (PP) — ৳750 referral bonus",
    time: "3 hr ago",
  },
  {
    id: 4,
    title: "Wallet withdrawal",
    name: "Jamal Ahmed ",
    description: "— (EM) — ৳12,500 to bkash",
    time: "5 hr ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="w-full bg-white rounded-xl p-6 border">
      <h2 className=" font-semibold text-[24px] leading-[120%] tracking-[-0.01em] align-middle mb-4 text-[#030712]">
        Recent Activity
      </h2>

      <div className="divide-y">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-3">
              {/* icon */}
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <ArrowUpRight size={16} className="text-green-600" />
              </div>

              {/* text */}
              <div className="flex flex-col ">
                <div>
                  <p className=" font-semibold text-[16px] leading-[150%] tracking-[-0.01em] align-middle text-[#131C20]">
                    {activity.title}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-1">
                  <p className=" font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle text-[#73808C]">
                    {activity.name}
                  </p>
                  <p className=" font-normal text-[12px] leading-[160%] tracking-[-0.01em] align-middle text-[#73808C]">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>

            {/* time */}
            <span className="text-xs text-gray-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
