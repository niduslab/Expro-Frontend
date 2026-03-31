"use client";

import { Branch } from "@/lib/types/branchType";
import { Pencil } from "lucide-react";

interface BranchDetailModalProps {
  open: boolean;
  onClose: () => void;
  branch: Branch | null;
  onEdit: (branch: Branch) => void;
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

export default function BranchDetailModal({
  open,
  onClose,
  branch,
  onEdit,
}: BranchDetailModalProps) {
  if (!open || !branch) return null;

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
      {/* Modal — fixed height with internal scroll */}
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black overflow-hidden">
        {/* ── Fixed Header ── */}
        <div className="flex-shrink-0 flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
              Branch Details
            </p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Full information for this branch.
          </p>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Section 1: Branch Details */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                  Branch Details
                </p>
                {branch.is_active ? (
                  <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[#DCFCE7] text-[#16A34A] font-semibold text-[12px] leading-[150%]">
                    ● Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[#FEE2E2] text-[#DC2626] font-semibold text-[12px] leading-[150%]">
                    ● Inactive
                  </span>
                )}
              </div>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField label="Branch Code" value={branch.code} />
                </div>
                <div className="w-1/2">
                  <DetailField label="Branch Name" value={branch.name} />
                </div>
              </div>

              {branch.name_bangla && (
                <DetailField label="Name (Bangla)" value={branch.name_bangla} />
              )}

              <SectionDivider />
            </div>

            {/* Section 2: Location */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Location
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField label="District" value={branch.district} />
                </div>
                <div className="w-1/2">
                  <DetailField label="Division" value={branch.division} />
                </div>
              </div>

              <DetailField label="Address" value={branch.address} />

              <SectionDivider />
            </div>

            {/* Section 3: Contact */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Contact Information
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Contact Number"
                    value={branch.contact_number}
                  />
                  <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                    Primary contact for this branch
                  </span>
                </div>
                <div className="w-1/2">
                  <DetailField label="Email Address" value={branch.email} />
                  <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                    Official branch email address
                  </span>
                </div>
              </div>

              <SectionDivider />
            </div>

            {/* Section 4: Record Info */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Record Info
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Created At"
                    value={formatDate(branch.created_at)}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Last Updated"
                    value={formatDate(branch.updated_at)}
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
            onClick={() => onEdit(branch)}
            className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Branch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
