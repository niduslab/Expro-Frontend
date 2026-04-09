"use client";

import Image from "next/image";
import {
  Users,
  User,
  Phone,
  MapPin,
  CreditCard,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:8000";

const storageUrl = (path: string) =>
  path?.startsWith("http") ? path : `${BASE_URL}/storage/${path}`;

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export default function NomineePage() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#068847] mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">Loading nominees…</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const nominees: any[] = profile.nominee || [];
  const primary = nominees.find((n) => n.is_primary);
  const totalShare = nominees.reduce(
    (sum, n) => sum + parseFloat(n.percentage || "0"),
    0,
  );

  return (
    <div className="container mx-auto  mb-4 ">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* ── Page title ── */}
        <div>
          <h1 className="text-lg font-semibold text-[#030712]">Nominees</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            People designated to receive your benefits
          </p>
        </div>

        {/* ── Summary bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3">
            <p className="text-[11px] text-[#9CA3AF] mb-1">Total nominees</p>
            <p className="text-2xl font-semibold text-[#030712]">
              {nominees.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3">
            <p className="text-[11px] text-[#9CA3AF] mb-1">Share allocated</p>
            <p className="text-2xl font-semibold text-[#030712]">
              {totalShare.toFixed(0)}
              <span className="text-base font-normal text-[#6B7280]">%</span>
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 col-span-2 sm:col-span-1">
            <p className="text-[11px] text-[#9CA3AF] mb-1">Primary nominee</p>
            <p className="text-sm font-semibold text-[#030712] truncate">
              {primary?.nominee_name_english || "—"}
            </p>
          </div>
        </div>

        {/* ── Share unallocated warning ── */}
        {totalShare < 100 && nominees.length > 0 && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              Only <strong>{totalShare.toFixed(0)}%</strong> of your benefit
              share has been allocated. The remaining{" "}
              <strong>{(100 - totalShare).toFixed(0)}%</strong> is unassigned.
            </p>
          </div>
        )}

        {/* ── Nominees list or empty state ── */}
        {nominees.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-[#D1D5DB]" />
            </div>
            <h3 className="text-sm font-semibold text-[#030712] mb-1">
              No nominees added
            </h3>
            <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
              You haven't designated any nominees yet. Contact your branch or
              admin to add nominees to your account.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {nominees.map((nominee, index) => (
              <NomineeCard key={nominee.id} nominee={nominee} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NomineeCard({ nominee, index }: { nominee: any; index: number }) {
  const initials = (nominee.nominee_name_english || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const shareNum = parseFloat(nominee.percentage || "0");

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-[#F3F4F6]">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {nominee.nominee_photo ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000"}/storage/${nominee.nominee_photo}`}
              alt={nominee.nominee_name_english}
              width={52}
              height={52}
              unoptimized
              className="w-13 h-13 rounded-xl object-cover border border-[#E5E7EB]"
            />
          ) : (
            <div className="w-[52px] h-[52px] p-4 rounded-xl bg-[#E0E7FF] flex items-center justify-center text-[#4338CA] text-base font-semibold">
              {initials}
            </div>
          )}
        </div>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-semibold text-[#030712]">
              {nominee.nominee_name_english}
            </h3>
            {nominee.is_primary && (
              <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 bg-[#068847] text-white rounded-full">
                <BadgeCheck className="w-[4px] h-[4px]" />
                Primary
              </span>
            )}
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                nominee.is_active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {nominee.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          {nominee.nominee_name_bangla && (
            <p className="text-xs text-[#6B7280]">
              {nominee.nominee_name_bangla}
            </p>
          )}
          <p className="text-xs text-[#9CA3AF] mt-0.5">{nominee.relation}</p>
        </div>

        {/* Share donut-style indicator */}
        <div className="flex-shrink-0 text-right">
          <p className="text-[11px] text-[#9CA3AF] mb-0.5">Benefit share</p>
          <p className="text-2xl font-semibold text-[#030712] leading-none">
            {shareNum.toFixed(0)}
            <span className="text-sm font-normal text-[#6B7280]">%</span>
          </p>
          {/* thin progress bar */}
          <div className="w-20 h-1 bg-[#F3F4F6] rounded-full mt-1.5 overflow-hidden ml-auto">
            <div
              className="h-full bg-[#068847] rounded-full"
              style={{ width: `${Math.min(shareNum, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card body: 2-col info grid */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        {/* Left column */}
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
            Personal Details
          </p>
          <div className="space-y-0">
            <InfoRow
              label="Date of birth"
              value={fmtDate(nominee.nominee_date_of_birth)}
            />
            <InfoRow label="Relation" value={nominee.relation} capitalize />
            <InfoRow
              label="NID number"
              value={nominee.nominee_nid_number}
              mono
            />
          </div>
        </div>

        {/* Right column */}
        <div className="mt-4 sm:mt-0">
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
            Contact
          </p>
          <div className="space-y-0">
            <InfoRow label="Mobile" value={nominee.nominee_mobile} />
            <InfoRow label="Address" value={nominee.address} />
          </div>
        </div>
      </div>

      {/* Nominee photo / NID (if uploaded) */}
      {nominee.nominee_photo && (
        <div className="px-5 pb-4">
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
            Photo
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000"}/storage/${nominee.nominee_photo}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative w-24 h-28 rounded-xl overflow-hidden border border-[#E5E7EB] hover:opacity-80 transition-opacity">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000"}/storage/${nominee.nominee_photo}`}
                alt="Nominee photo"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </a>
        </div>
      )}
    </div>
  );
}

/* ── Shared helpers ── */

function InfoRow({
  label,
  value,
  mono,
  capitalize,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-2 last:border-0 gap-3">
      <span className="text-[11px] text-[#9CA3AF] flex-shrink-0 pt-px">
        {label}
      </span>
      <span
        className={`text-[12px] text-[#030712] font-medium text-right ${
          mono ? "font-mono" : ""
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value ?? <span className="text-[#D1D5DB] font-normal">—</span>}
      </span>
    </div>
  );
}
