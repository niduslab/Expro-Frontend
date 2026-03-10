import ComingSoon from "@/components/coming-soon/page";
import React from "react";

const Settings = () => {
  return (
    <>
      <div className="w-[1133px] flex flex-col   gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Notifications
          </p>
          <p className="text-sm text-[#4A5565]">
            Manage all your notifications here
          </p>
        </div>
        <ComingSoon title="Notifications" />
      </div>
    </>
  );
};

export default Settings;
