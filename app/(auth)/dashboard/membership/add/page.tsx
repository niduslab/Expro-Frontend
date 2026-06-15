"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAvailableRoles } from "@/lib/hooks/user/usePensionRoleApplications";
import { useMemberDashboard } from "@/lib/hooks/admin/useUsers";
import MembershipForm from "@/components/public/membership/MembershipForm";

const ELIGIBLE_ROLES = ["executive_member", "project_presenter", "assistant_pp"];

export default function AddMemberPage() {
  const router = useRouter();
  const { data: availableRolesData, isLoading: loadingRoles } = useAvailableRoles();
  const { data: dashboardData, isLoading: loadingDashboard } = useMemberDashboard();

  const currentRole = availableRolesData?.data?.current_role;
  const hasAdvancedRole = currentRole && ELIGIBLE_ROLES.includes(currentRole.value);

  if (loadingRoles || loadingDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#068847]" />
      </div>
    );
  }

  if (!hasAdvancedRole) {
    router.replace("/dashboard/membership");
    return null;
  }

  const memberProfile = dashboardData?.member_profile;
  const user = dashboardData?.user;

  const sponsorName = memberProfile?.name_english || user?.name || "";
  const sponsorMemberId = user?.member_id || "";
  const sponsorUserId = user?.id;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <MembershipForm
        initialSponsorInfo={{
          sponsorName,
          sponsorMemberId,
          sponsorUserId,
          isVerified: true,
        }}
        lockSponsor
      />
    </div>
  );
}
