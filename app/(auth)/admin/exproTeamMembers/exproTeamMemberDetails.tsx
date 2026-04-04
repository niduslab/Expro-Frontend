"use client";

import { ExproTeamMember } from "@/lib/types/admin/exproTeamMemberType";
import { Pencil } from "lucide-react";

interface ExproTeamMemberDetailModalProps {
  open: boolean;
  onClose: () => void;
  member: ExproTeamMember | null;
  onEdit: (member: ExproTeamMember) => void;
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-[12px] leading-[150%] tracking-[-0.01em] text-[#6A7282] uppercase">
        {label}
      </span>
      <span className="font-normal text-[14px] leading-[160%] tracking-[-0.01em] text-[#030712]">
        {value || "—"}
      </span>
    </div>
  );
}

function SectionDivider() {
  return <div className="w-full border border-[#E5E7EB]" />;
}

export default function ExproTeamMemberDetailModal({
  open,
  onClose,
  member,
  onEdit,
}: ExproTeamMemberDetailModalProps) {
  if (!open || !member) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black overflow-hidden">
        {/* ── Fixed Header ── */}
        <div className="flex-shrink-0 flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
              Team Member Details
            </p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Full information for this team member.
          </p>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Section 1: Member Details */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Member Details
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField label="Full Name" value={member.name} />
                </div>
                <div className="w-1/2">
                  <DetailField label="Designation" value={member.designation} />
                </div>
              </div>

              <SectionDivider />
            </div>

            {/* Section 2: Profile Image */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Profile Image
              </p>

              {member.image_url ? (
                <div className="flex flex-col gap-2">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-24 h-24 rounded-xl object-cover border border-[#E5E7EB]"
                  />
                  <DetailField label="Image URL" value={member.image_url} />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] text-[32px] font-semibold">
                    {member.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <span className="text-[14px] text-[#6A7282]">
                    No image provided
                  </span>
                </div>
              )}

              <SectionDivider />
            </div>

            {/* Section 3: Record Info */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Record Info
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Created At"
                    value={formatDate(member.created_at)}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Last Updated"
                    value={formatDate(member.updated_at)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Fixed Footer ── */}
        <div className="flex-shrink-0 flex items-center gap-[16px] px-6 py-4 border-t border-[#E5E7EB] bg-white">
          <button
            onClick={onClose}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em]"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(member)}
            className="bg-[#068847] h-[48px] w-[200px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Member</span>
          </button>
        </div>
      </div>
    </div>
  );
}
