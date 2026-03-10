import ComingSoon from "@/components/coming-soon/page";

const AllPensionMembers = () => {
  return (
    <>
      <div className="container flex flex-col   gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            All Pension Members
          </p>
          <p className="text-sm text-[#4A5565]">
            Explore Members associated with pensions.
          </p>
        </div>
        <ComingSoon title="All Pension Members" />
      </div>
    </>
  );
};

export default AllPensionMembers;
