"use client";

import { ArrowLeft, Edit } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MemberHeaderProps {
  member: any;
  memberProfile: any;
  onEditClick: () => void;
}

export default function MemberHeader({ member, memberProfile, onEditClick }: MemberHeaderProps) {
  const router = useRouter();

  const getStatusBadge = () => {
    const status = member.status === "approved" ? "active" : member.status;
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: "bg-[#CCFBF1]", text: "text-[#0D9488]", label: "Active" },
      pending: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", label: "Pending" },
      inactive: { bg: "bg-[#F3F4F6]", text: "text-gray-700", label: "Inactive" },
      suspended: { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", label: "Suspended" },
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
        <span className={`w-2 h-2 rounded-full ${config.text.replace('text-', 'bg-')}`} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#4A5565] hover:text-[#068847] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Members</span>
        </button>
        <button 
          onClick={onEditClick}
          className="flex items-center gap-2 px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Member
        </button>
      </div>

      <div className="flex items-center gap-6">
        {memberProfile?.photo ? (
          <Image
            src={
              memberProfile.photo.startsWith('http') 
                ? memberProfile.photo 
                : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${memberProfile.photo}`
            }
            alt={memberProfile.name_english || "Member"}
            width={96}
            height={96}
            className="rounded-full object-cover w-24 h-24"
            unoptimized
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#068847] to-[#045a2e] flex items-center justify-center text-white text-3xl font-bold">
            {memberProfile?.name_english?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "NA"}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#030712] mb-2">
            {memberProfile?.name_english || member.email}
          </h1>
          <p className="text-[#4A5565] mb-3">
            {memberProfile?.member_id || `ID: ${member.id}`}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {getStatusBadge()}
            <span className={`inline-flex text-[12px] font-medium px-3 py-1 rounded-full ${
              memberProfile?.membership_type === "executive"
                ? "text-[#6366F1] bg-[#E0E7FF]"
                : "text-[#65A30D] bg-[#ECFCCB]"
            }`}>
              {memberProfile?.membership_type === "executive" ? "Executive" : "General"}
            </span>
            <span className="text-sm text-[#6B7280]">
              Last Login: {member.last_login_at
                ? new Date(member.last_login_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
