import ComingSoon from "@/components/coming-soon/page";
import React from "react";

const Settings = () => {
  return (
    <>
      <div className="container flex flex-col   gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Settings
          </p>
          <p className="text-sm text-[#4A5565]">Set up your admin dashboard</p>
          <div>
            <ComingSoon title="Settings" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
