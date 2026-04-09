"use client";

import Image from "next/image";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Shield,
  Mail,
  BadgeCheck,
  BookOpen,
  Users,
  Edit2,
} from "lucide-react";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:8000";

const storageUrl = (path: string) =>
  path.startsWith("http") ? path : `${BASE_URL}/storage/${path}`;

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export default function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#068847] mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const m = profile.member;
  const initials = (m?.name_english || profile.email || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusConfig: Record<
    string,
    { bg: string; text: string; dot: string }
  > = {
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    inactive: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
    suspended: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  };
  const status =
    (profile.status === "approved" ? "active" : profile.status) || "inactive";
  const sc = statusConfig[status] || statusConfig.inactive;

  return (
    <div className="container mx-auto  mb-4 ">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* ── Page title row ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#030712]">My Profile</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">
              View and manage your personal information
            </p>
          </div>
        </div>

        {/* ── Profile hero card ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          {/* Avatar + name row */}
          <div className="px-5 md:px-6 pb-5">
            <div className="flex items-end justify-between -mt-10 mb-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {m?.photo ? (
                  <Image
                    src={storageUrl(m.photo)}
                    alt={m.name_english || "Profile"}
                    width={80}
                    height={80}
                    unoptimized
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#068847] border-4 border-white shadow-sm flex items-center justify-center text-white text-2xl font-semibold tracking-tight">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            {/* Name + meta */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-semibold text-[#030712]">
                    {m?.name_english || profile.email}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${sc.dot} flex-shrink-0`}
                    />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  {m?.membership_type && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#E0E7FF] text-[#4338CA]">
                      <BadgeCheck className="w-3 h-3" />
                      {m.membership_type.charAt(0).toUpperCase() +
                        m.membership_type.slice(1)}
                    </span>
                  )}
                </div>
                {m?.name_bangla && (
                  <p className="text-sm text-[#6B7280] mt-0.5">
                    {m.name_bangla}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <Mail className="w-3.5 h-3.5" />
                    {profile.email}
                  </span>
                  {m?.mobile && (
                    <span className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                      <Phone className="w-3.5 h-3.5" />
                      {m.mobile}
                    </span>
                  )}
                  {m?.member_id && (
                    <span className="flex items-center gap-1.5 text-xs text-[#6B7280] font-mono">
                      <Shield className="w-3.5 h-3.5" />
                      {m.member_id}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main grid: 2/3 + 1/3 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Personal Information */}
            <Section
              icon={<User className="w-4 h-4 text-[#068847]" />}
              title="Personal Information"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <InfoRow label="Full name (English)" value={m?.name_english} />
                <InfoRow label="Full name (Bangla)" value={m?.name_bangla} />
                <InfoRow
                  label="Father / Husband"
                  value={m?.father_husband_name}
                />
                <InfoRow label="Mother's name" value={m?.mother_name} />
                <InfoRow
                  label="Date of birth"
                  value={fmtDate(m?.user_date_of_birth)}
                />
                <InfoRow label="Gender" value={m?.gender} capitalize />
                <InfoRow label="Religion" value={m?.religion} capitalize />
                <InfoRow
                  label="Education"
                  value={
                    m?.academic_qualification_other || m?.academic_qualification
                  }
                  capitalize
                />
                <InfoRow label="NID number" value={m?.nid_number} mono />
              </div>
            </Section>

            {/* Contact Information */}
            <Section
              icon={<Phone className="w-4 h-4 text-[#068847]" />}
              title="Contact Information"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <InfoRow label="Email address" value={profile.email} />
                <InfoRow label="Mobile" value={m?.mobile} />
                <InfoRow label="Alternate mobile" value={m?.alternate_mobile} />
              </div>
            </Section>

            {/* Address */}
            <Section
              icon={<MapPin className="w-4 h-4 text-[#068847]" />}
              title="Address"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-1.5">
                    Present address
                  </p>
                  <p className="text-sm text-[#030712] leading-relaxed">
                    {m?.present_address || (
                      <span className="text-[#9CA3AF]">—</span>
                    )}
                  </p>
                </div>
                <div className="border-t border-[#F3F4F6] pt-4">
                  <p className="text-xs font-medium text-[#6B7280] mb-1.5">
                    Permanent address
                  </p>
                  <p className="text-sm text-[#030712] leading-relaxed">
                    {m?.permanent_address || (
                      <span className="text-[#9CA3AF]">—</span>
                    )}
                  </p>
                </div>
              </div>
            </Section>

            {/* Documents */}
            <Section
              icon={<CreditCard className="w-4 h-4 text-[#068847]" />}
              title="Identity Documents"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "NID front", path: m?.nid_front_photo },
                  { label: "NID back", path: m?.nid_back_photo },
                  { label: "Signature", path: m?.signature, contain: true },
                ].map(({ label, path, contain }) => (
                  <div key={label}>
                    <p className="text-xs font-medium text-[#6B7280] mb-2">
                      {label}
                    </p>
                    {path ? (
                      <a
                        href={storageUrl(path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="relative w-full h-28 rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB]">
                          <Image
                            src={storageUrl(path)}
                            alt={label}
                            fill
                            unoptimized
                            className={`${contain ? "object-contain p-2" : "object-cover"} group-hover:opacity-80 transition-opacity`}
                          />
                        </div>
                      </a>
                    ) : (
                      <div className="w-full h-28 rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] flex flex-col items-center justify-center gap-1.5">
                        <CreditCard className="w-5 h-5 text-[#D1D5DB]" />
                        <p className="text-[11px] text-[#9CA3AF]">
                          Not uploaded
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Profile photo */}
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-2">
                    Profile photo
                  </p>
                  {m?.photo ? (
                    <a
                      href={storageUrl(m.photo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="relative w-full h-28 rounded-xl overflow-hidden border border-[#E5E7EB]">
                        <Image
                          src={storageUrl(m.photo)}
                          alt="Profile photo"
                          fill
                          unoptimized
                          className="object-cover group-hover:opacity-80 transition-opacity"
                        />
                      </div>
                    </a>
                  ) : (
                    <div className="w-full h-28 rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] flex flex-col items-center justify-center gap-1.5">
                      <User className="w-5 h-5 text-[#D1D5DB]" />
                      <p className="text-[11px] text-[#9CA3AF]">Not uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </Section>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-5">
            {/* Membership */}
            <Section
              icon={<Calendar className="w-4 h-4 text-[#068847]" />}
              title="Membership"
            >
              <div className="space-y-0">
                <InfoRow label="Member ID" value={m?.member_id} mono />
                <InfoRow label="Type" value={m?.membership_type} capitalize />
                <InfoRow
                  label="Member since"
                  value={fmtDate(m?.membership_date)}
                />
                <InfoRow
                  label="Expiry date"
                  value={fmtDate(m?.membership_expiry_date)}
                />
                <InfoRow
                  label="Fee paid"
                  value={`৳${parseFloat(String(m?.member_fee_paid ?? 0)).toLocaleString()}`}
                />
                <InfoRow
                  label="Missed payments"
                  value={String(m?.consecutive_missed_payments ?? 0)}
                />
              </div>
            </Section>

            {/* Account */}
            <Section
              icon={<Shield className="w-4 h-4 text-[#068847]" />}
              title="Account"
            >
              <div className="space-y-0">
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Status" value={status} capitalize />
                <InfoRow
                  label="Last login"
                  value={
                    profile.last_login_at
                      ? new Date(profile.last_login_at).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )
                      : "—"
                  }
                />
                {profile.roles?.length > 0 && (
                  <div className="py-3 border-b border-[#F3F4F6] last:border-0">
                    <p className="text-[11px] text-[#9CA3AF] mb-1.5">Roles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.roles.map((r: string) => (
                        <span
                          key={r}
                          className="text-[11px] px-2 py-0.5 bg-[#E0E7FF] text-[#4338CA] rounded-full font-medium capitalize"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.permissions?.length > 0 && (
                  <div className="py-3">
                    <p className="text-[11px] text-[#9CA3AF] mb-1.5">
                      Permissions ({profile.permissions.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.permissions.map((p: string) => (
                        <span
                          key={p}
                          className="text-[11px] px-2 py-0.5 bg-[#F3F4F6] text-[#4B5563] rounded-full capitalize"
                        >
                          {p.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#F3F4F6]">
        <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-[#030712]">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
  capitalize,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-2.5  last:border-0 gap-4">
      <span className="text-[11px] text-[#9CA3AF] flex-shrink-0 pt-px leading-relaxed">
        {label}
      </span>
      <span
        className={`text-[13px] text-[#030712] font-medium text-right leading-relaxed ${mono ? "font-mono" : ""} ${capitalize ? "capitalize" : ""}`}
      >
        {value ?? <span className="text-[#D1D5DB] font-normal">—</span>}
      </span>
    </div>
  );
}
