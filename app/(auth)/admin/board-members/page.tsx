import ComingSoon from "@/components/coming-soon/page";
import React from "react";

const BoardMembers = () => {
  return (
    <>
      <div className="container flex flex-col   gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Board Members
          </p>
          <p className="text-sm text-[#4A5565]">
            Introducing Board Member management of Expro Welfare Foundation
          </p>
        </div>
        <ComingSoon title="Board Members" />
      </div>
    </>
  );
};

export default BoardMembers;
