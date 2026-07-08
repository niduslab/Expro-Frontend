"use client";

import { useState, useMemo } from "react";
import { X, GitBranch } from "lucide-react";
import { useChangeHierarchy } from "@/lib/hooks/admin/useMembers";
import { Member } from "@/lib/hooks/admin/useMembers";
import { toast } from "sonner";

interface ChangeHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: number;
  memberName: string;
  allMembers: Member[];
}

export default function ChangeHierarchyModal({
  isOpen,
  onClose,
  memberId,
  memberName,
  allMembers,
}: ChangeHierarchyModalProps) {
  const [selectedSponsorId, setSelectedSponsorId] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const { mutate: changeHierarchy, isPending } = useChangeHierarchy();

  // Only show members who have an active EM, PP, or APP role and are not the current member
  const eligibleSponsors = useMemo(() => {
    return allMembers.filter((m) => {
      if (m.id === memberId) return false;
      return m.pension_enrollments?.some((enrollment: any) =>
        enrollment.package_roles?.some(
          (role: any) =>
            role.is_active &&
            ["executive_member", "project_presenter", "assistant_pp"].includes(role.role)
        )
      );
    });
  }, [allMembers, memberId]);

  const filteredSponsors = useMemo(() => {
    if (!search.trim()) return eligibleSponsors;
    const q = search.toLowerCase();
    return eligibleSponsors.filter((m) => {
      const name = m.member?.name_english?.toLowerCase() || "";
      const id = m.member?.member_id?.toLowerCase() || "";
      const email = m.email?.toLowerCase() || "";
      return name.includes(q) || id.includes(q) || email.includes(q);
    });
  }, [eligibleSponsors, search]);

  const selectedSponsor = allMembers.find((m) => m.id === Number(selectedSponsorId));

  const getRoleLabel = (role: string) => {
    const map: Record<string, string> = {
      executive_member: "EM",
      project_presenter: "PP",
      assistant_pp: "APP",
    };
    return map[role] || role.toUpperCase();
  };

  const getSponsorRoles = (member: Member) => {
    const roles: string[] = [];
    member.pension_enrollments?.forEach((enrollment: any) => {
      enrollment.package_roles?.forEach((role: any) => {
        if (
          role.is_active &&
          ["executive_member", "project_presenter", "assistant_pp"].includes(role.role) &&
          !roles.includes(role.role)
        ) {
          roles.push(role.role);
        }
      });
    });
    return roles;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSponsorId) {
      toast.error("Please select a new sponsor");
      return;
    }

    toast.loading("Updating hierarchy...", { id: "change-hierarchy" });

    changeHierarchy(
      {
        userId: memberId,
        new_sponsor_id: Number(selectedSponsorId),
        reason: reason || undefined,
      },
      {
        onSuccess: (res: any) => {
          toast.success(res.message || "Hierarchy updated successfully!", {
            id: "change-hierarchy",
          });
          onClose();
          resetForm();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || err.message || "Failed to update hierarchy", {
            id: "change-hierarchy",
          });
        },
      }
    );
  };

  const resetForm = () => {
    setSelectedSponsorId("");
    setReason("");
    setSearch("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#030712]">Change Hierarchy</h3>
              <p className="text-sm text-[#4A5565]">{memberName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#4A5565]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Info box */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3">
            <p className="text-xs text-[#1E40AF]">
              <strong>Note:</strong> This reassigns all active enrollments of <strong>{memberName}</strong> to a new sponsor.
              The new sponsor must be an Executive Member (EM), Project Presenter (PP), or Assistant PP (APP).
            </p>
          </div>

          {/* Search sponsors */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Search New Sponsor
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-sm"
            />
          </div>

          {/* Sponsor selection */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Select New Sponsor <span className="text-red-500">*</span>
            </label>
            {eligibleSponsors.length === 0 ? (
              <p className="text-sm text-red-500">
                No eligible sponsors found. A sponsor must have an active EM, PP, or APP role.
              </p>
            ) : (
              <div className="border border-[#E5E7EB] rounded-lg max-h-52 overflow-y-auto divide-y divide-[#F3F4F6]">
                {filteredSponsors.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-gray-500">No results match your search.</p>
                ) : (
                  filteredSponsors.map((sponsor) => {
                    const sponsorRoles = getSponsorRoles(sponsor);
                    const sponsorName = sponsor.member?.name_english || sponsor.email || "Unknown";
                    const sponsorMemberId = sponsor.member?.member_id || `USR-${String(sponsor.id).padStart(5, "0")}`;
                    const isSelected = selectedSponsorId === String(sponsor.id);

                    return (
                      <button
                        key={sponsor.id}
                        type="button"
                        onClick={() => setSelectedSponsorId(String(sponsor.id))}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          isSelected
                            ? "bg-[#EFF6FF] border-l-2 border-[#2563EB]"
                            : "hover:bg-[#F9FAFB]"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{sponsorName}</p>
                          <p className="text-xs text-gray-500">{sponsorMemberId} · {sponsor.email}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {sponsorRoles.map((role) => (
                            <span
                              key={role}
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700"
                            >
                              {getRoleLabel(role)}
                            </span>
                          ))}
                        </div>
                        {isSelected && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" className="flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Selected sponsor preview */}
          {selectedSponsor && (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-3 flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <p className="text-sm font-medium text-[#15803D]">
                  New sponsor: {selectedSponsor.member?.name_english || selectedSponsor.email}
                </p>
                <p className="text-xs text-[#16A34A]">
                  {selectedSponsor.member?.member_id}
                </p>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Member stopped paying fee and does not wish to continue..."
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-sm resize-none"
            />
            <p className="text-xs text-[#6B7280] mt-1">{reason.length}/500 characters</p>
          </div>

          {/* Warning */}
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-3">
            <p className="text-xs text-[#92400E]">
              <strong>Warning:</strong> This will update the sponsor for all active enrollments of this member and rebuild their hierarchy chain.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#4A5565] hover:bg-[#F3F4F6] transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !selectedSponsorId}
              className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Updating..." : "Change Hierarchy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
