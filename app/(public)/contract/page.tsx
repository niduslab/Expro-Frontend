"use client";
import ComingSoon from "@/components/coming-soon/page";
import { useBranches } from "@/lib/hooks/public/useBranchesHook";

export default function Contract() {
  const { data, isLoading } = useBranches();
  console.log(data);
  return (
    <>
      <ComingSoon title="Contract" />
    </>
  );
}
