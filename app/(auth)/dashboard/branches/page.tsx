"use client";

import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Hash,
  Globe,
  Map,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Branch } from "@/lib/types/branchType";
import { useMyBranch } from "@/lib/hooks/user/useBranch";

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export default function BranchPage() {
  const { data: profile, isLoading } = useMyBranch();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#068847] mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">Loading branch info…</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const branch: Branch | null = profile.data ?? null;

  if (!branch) {
    return (
      <div className="container mx-auto mb-4">
        <div className="max-w-7xl mx-auto space-y-5">
          <div>
            <h1 className="text-lg font-semibold text-[#030712]">My Branch</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">
              Your assigned branch information
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-[#D1D5DB]" />
            </div>
            <h3 className="text-sm font-semibold text-[#030712] mb-1">
              No branch assigned
            </h3>
            <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
              You haven't been assigned to a branch yet. Please contact your
              administrator to get a branch assigned to your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] ">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* ── Page title ── */}
        <div>
          <h1 className="text-lg font-semibold text-[#030712]">My Branch</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Your assigned branch information
          </p>
        </div>

        {/* ── Branch hero card ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="px-5 md:px-6 pb-5">
            {/* Icon overlapping band */}
            <div className="flex items-end justify-between mt-8 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-[#068847] border-4 border-white shadow-sm flex items-center justify-center flex-shrink-0">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              {/* Status badge */}
              <div className="mb-1">
                {branch.is_active ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Active branch
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                    <XCircle className="w-3 h-3" />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Branch name */}
            <h2 className="text-xl font-semibold text-[#030712]">
              {branch.name}
            </h2>
            {branch.name_bangla && (
              <p className="text-sm text-[#6B7280] mt-0.5">
                {branch.name_bangla}
              </p>
            )}

            {/* Quick meta row */}
            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                Code:&nbsp;
                <span className="font-mono font-medium text-[#030712]">
                  {branch.code}
                </span>
              </span>
              {branch.district && (
                <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {branch.district}
                </span>
              )}
              {branch.division && (
                <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                  <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                  {branch.division}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Detail grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Location */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 ">
              <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-[#068847]" />
              </div>
              <h3 className="text-sm font-semibold text-[#030712]">Location</h3>
            </div>
            <div className="px-5 py-4 space-y-0">
              <InfoRow label="District" value={branch.district} capitalize />
              <InfoRow label="Division" value={branch.division} capitalize />
              <InfoRow label="Address" value={branch.address} />
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#F3F4F6]">
              <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-[#068847]" />
              </div>
              <h3 className="text-sm font-semibold text-[#030712]">Contact</h3>
            </div>
            <div className="px-5 py-4 space-y-0">
              <InfoRow label="Phone" value={branch.contact_number} />
              <InfoRow label="Email" value={branch.email} />
            </div>
          </div>

          {/* Branch details */}
          <div className="bg-white rounded-xl  overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 ">
              <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-[#068847]" />
              </div>
              <h3 className="text-sm font-semibold text-[#030712]">
                Branch Details
              </h3>
            </div>
            <div className="px-5 py-4 space-y-0">
              <InfoRow label="Branch ID" value={String(branch.id)} mono />
              <InfoRow label="Branch code" value={branch.code} mono />
              <InfoRow label="Name" value={branch.name} />
              <InfoRow label="Name (Bangla)" value={branch.name_bangla} />
              <InfoRow
                label="Status"
                value={branch.is_active ? "Active" : "Inactive"}
                valueClass={
                  branch.is_active ? "text-emerald-700" : "text-red-600"
                }
              />
              <InfoRow label="Created" value={fmtDate(branch.created_at)} />
              <InfoRow label="Updated" value={fmtDate(branch.updated_at)} />
            </div>
          </div>

          {/* Address full */}
          {branch.address && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#F3F4F6]">
                <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
                  <Map className="w-4 h-4 text-[#068847]" />
                </div>
                <h3 className="text-sm font-semibold text-[#030712]">
                  Full Address
                </h3>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-[#030712] leading-relaxed">
                  {branch.address}
                </p>
                {(branch.district || branch.division) && (
                  <p className="text-xs text-[#6B7280] mt-1.5">
                    {[branch.district, branch.division]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shared helper ── */

function InfoRow({
  label,
  value,
  mono,
  capitalize,
  valueClass,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  capitalize?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between py-2.5  last:border-0 gap-4">
      <span className="text-[11px] text-[#9CA3AF] flex-shrink-0 pt-px">
        {label}
      </span>
      <span
        className={`text-[12px] font-medium text-right leading-relaxed ${
          mono ? "font-mono" : ""
        } ${capitalize ? "capitalize" : ""} ${valueClass ?? "text-[#030712]"}`}
      >
        {value ?? <span className="text-[#D1D5DB] font-normal">—</span>}
      </span>
    </div>
  );
}
