"use client";

import Image from "next/image";
import {
  Folders,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  BadgeCheck,
  StickyNote,
  TrendingUp,
  Globe,
  Star,
  Layers,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { useMyProjects } from "@/lib/hooks/user/useProject";
import {
  ProjectMember,
  Project,
  MemberStatus,
  PROJECT_ROLE_LABELS,
  MEMBER_STATUS_LABELS,
} from "@/lib/types/projectMemberType";

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:8000";

const storageUrl = (path?: string | null) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${BASE_URL}/storage/${path}`;
};

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const fmtCurrency = (n?: string | number | null) => {
  const val = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  return val > 0
    ? `৳${val.toLocaleString("en-US", { minimumFractionDigits: 0 })}`
    : "৳0";
};

const daysUntil = (d?: string | null) => {
  if (!d) return null;
  return Math.ceil(
    (new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
};

// ── Status configs ────────────────────────────────────────────────────────────

const memberStatusConfig: Record<
  MemberStatus,
  { bg: string; text: string; dot: string }
> = {
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  inactive: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
  suspended: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  expired: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-300" },
};

const projectStatusConfig: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700" },
  planned: { bg: "bg-blue-50", text: "text-blue-700" },
  ongoing: { bg: "bg-sky-50", text: "text-sky-700" },
  completed: { bg: "bg-gray-100", text: "text-gray-600" },
  cancelled: { bg: "bg-red-50", text: "text-red-600" },
};

const roleBg: Record<string, string> = {
  chairman: "bg-purple-50 text-purple-700 border-purple-200",
  admin: "bg-blue-50 text-blue-700 border-blue-200",
  executive_member: "bg-emerald-50 text-emerald-700 border-emerald-200",
  project_presenter: "bg-sky-50 text-sky-700 border-sky-200",
  assistant_pp: "bg-cyan-50 text-cyan-700 border-cyan-200",
  general_member: "bg-gray-100 text-gray-600 border-gray-200",
};

// ── Filter tabs ───────────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: MemberStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
  { label: "Expired", value: "expired" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyProjectsPage() {
  const [status, setStatus] = useState<MemberStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const { data, isLoading } = useMyProjects({
    status,
    page,
    per_page: PER_PAGE,
  });

  const members: ProjectMember[] = data?.data ?? [];
  const pagination = data?.pagination;

  const totalFees = members.reduce(
    (s, m) => s + parseFloat(m.joining_fee_paid ?? "0"),
    0,
  );
  const activeCount = members.filter((m) => m.status === "active").length;
  const totalDownline = members.reduce(
    (s, m) => s + m.current_downline_count,
    0,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#068847] mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">Loading memberships…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mb-6">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* ── Header ── */}
        <div>
          <h1 className="text-lg font-semibold text-[#030712]">My Projects</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Your project memberships and roles
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Memberships"
            value={String(pagination?.total ?? members.length)}
            icon={<Folders className="w-4 h-4 text-[#068847]" />}
          />
          <StatCard
            label="Active"
            value={String(activeCount)}
            icon={<BadgeCheck className="w-4 h-4 text-[#068847]" />}
          />
          <StatCard
            label="Fees paid"
            value={
              totalFees > 0 ? `৳${Math.round(totalFees).toLocaleString()}` : "—"
            }
            icon={<DollarSign className="w-4 h-4 text-[#068847]" />}
          />
          <StatCard
            label="Total downline"
            value={String(totalDownline)}
            icon={<Users className="w-4 h-4 text-[#068847]" />}
          />
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                status === tab.value
                  ? "bg-[#068847] text-white"
                  : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#068847] hover:text-[#068847]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Cards ── */}
        {members.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination && pagination.last_page > 1 && (
          <Pagination
            page={page}
            perPage={PER_PAGE}
            total={pagination.total}
            dataLength={members.length}
            onNext={() => setPage((p) => p + 1)}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}

// ── Member Card ───────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: ProjectMember }) {
  const msc = memberStatusConfig[member.status] ?? memberStatusConfig.inactive;
  const rc = roleBg[member.project_role] ?? roleBg.general_member;
  const p = member.project;

  const imgSrc = storageUrl(p?.featured_image);

  const maxDl = member.max_downline_members;
  const curDl = member.current_downline_count;
  const dlPct =
    maxDl && maxDl > 0 ? Math.min(Math.round((curDl / maxDl) * 100), 100) : 0;

  const budget = parseFloat(p?.budget ?? "0");
  const raised = parseFloat(p?.funds_raised ?? "0");
  const utilized = parseFloat(p?.funds_utilized ?? "0");
  const raisedPct =
    budget > 0 ? Math.min(Math.round((raised / budget) * 100), 100) : 0;
  const utilizedPct =
    budget > 0 ? Math.min(Math.round((utilized / budget) * 100), 100) : 0;

  const days = daysUntil(member.expiry_date);
  const expiringSoon = days !== null && days >= 0 && days <= 30;
  const isExpired = days !== null && days < 0;

  const psc =
    projectStatusConfig[p?.status ?? ""] ?? projectStatusConfig.planned;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* ── Project image / placeholder ── */}
      {imgSrc ? (
        <div className="relative w-full h-36 bg-[#F3F4F6] flex-shrink-0 overflow-hidden group">
          <Image
            src={imgSrc}
            alt={p?.title ?? "Project"}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={imgSrc.startsWith("http")}
          />
          <ProjectImageBadges project={p} />
        </div>
      ) : (
        <div className="w-full h-28 bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] flex items-center justify-center relative flex-shrink-0">
          <Layers className="w-9 h-9 text-[#A7F3D0]" />
          <ProjectImageBadges project={p} />
        </div>
      )}

      {/* ── Card header: project info ── */}
      <div className="px-5 pt-4 pb-3 border-b border-[#F3F4F6]">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#9CA3AF] mb-0.5">
              Project #{member.project_id} · Member #{member.id}
            </p>
            <h3 className="text-sm font-semibold text-[#030712] leading-snug truncate">
              {p?.title ?? `Project #${member.project_id}`}
            </h3>
            {p?.title_bangla && (
              <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                {p.title_bangla}
              </p>
            )}
          </div>
          {/* Membership status */}
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${msc.bg} ${msc.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${msc.dot}`} />
            {MEMBER_STATUS_LABELS[member.status]}
          </span>
        </div>

        {/* Category + project status */}
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {p?.category && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] capitalize">
              <Tag className="w-2.5 h-2.5" />
              {p.category}
            </span>
          )}
          {p?.status && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${psc.bg} ${psc.text}`}
            >
              {p.status}
            </span>
          )}
        </div>

        {/* Short description */}
        {p?.short_description && (
          <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-2 mt-2">
            {p.short_description}
          </p>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="px-5 py-4 space-y-3 flex-1">
        {/* My membership role + hierarchy */}
        <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-[#F3F4F6]">
          <span
            className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${rc}`}
          >
            {PROJECT_ROLE_LABELS[member.project_role]}
          </span>
          <span className="text-[10px] text-[#9CA3AF]">
            Level {member.hierarchy_level}
          </span>
          {member.parent_member_id && (
            <span className="text-[10px] text-[#9CA3AF]">
              · Under #{member.parent_member_id}
            </span>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            label="Joined"
            value={fmtDate(member.joining_date)}
            icon={<Calendar className="w-3 h-3" />}
          />
          <InfoItem
            label="Expires"
            value={
              member.expiry_date ? fmtDate(member.expiry_date) : "No expiry"
            }
            icon={<Clock className="w-3 h-3" />}
            warn={expiringSoon}
            muted={isExpired}
            hint={
              expiringSoon
                ? `Expires in ${days} day${days === 1 ? "" : "s"}`
                : isExpired
                  ? "Expired"
                  : undefined
            }
          />
        </div>

        {/* Fees */}
        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            label="Joining fee paid"
            value={fmtCurrency(member.joining_fee_paid)}
            icon={<DollarSign className="w-3 h-3" />}
          />
          <InfoItem
            label="Payment ref"
            value={member.payment_id ? `#${member.payment_id}` : "—"}
          />
        </div>

        {/* Project budget / funds raised */}
        {budget > 0 && (
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Funds raised
              </span>
              <span className="text-[10px] font-medium text-[#030712]">
                {fmtCurrency(raised)} / {fmtCurrency(budget)}
              </span>
            </div>
            <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#068847] transition-all"
                style={{ width: `${raisedPct}%` }}
              />
            </div>
            {utilized > 0 && (
              <>
                <div className="flex items-center justify-between mt-2 mb-1">
                  <span className="text-[10px] text-[#9CA3AF]">Utilized</span>
                  <span className="text-[10px] font-medium text-[#030712]">
                    {fmtCurrency(utilized)} ({utilizedPct}%)
                  </span>
                </div>
                <div className="h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all"
                    style={{ width: `${utilizedPct}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Downline progress */}
        {maxDl != null && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                <Users className="w-3 h-3" />
                Downline members
              </span>
              <span className="text-[10px] font-medium text-[#030712]">
                {curDl} / {maxDl}
              </span>
            </div>
            <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${dlPct}%`,
                  background: dlPct >= 90 ? "#f59e0b" : "#068847",
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#9CA3AF]">
                {dlPct}% filled
              </span>
              <span className="text-[10px] text-[#9CA3AF]">
                {maxDl - curDl} slots left
              </span>
            </div>
          </div>
        )}

        {/* Notes */}
        {member.notes && (
          <div className="flex items-start gap-2 bg-[#F9FAFB] rounded-lg px-3 py-2">
            <StickyNote className="w-3 h-3 text-[#9CA3AF] mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              {member.notes}
            </p>
          </div>
        )}
      </div>

      {/* ── Card footer: project dates ── */}
      {(p?.start_date || p?.end_date) && (
        <div className="px-5 py-3 bg-[#F9FAFB] border-t border-[#F3F4F6] flex items-center gap-4 flex-wrap">
          {p?.start_date && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
              <Calendar className="w-3 h-3" />
              Start: {fmtDate(p.start_date)}
            </span>
          )}
          {p?.end_date && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
              <Clock className="w-3 h-3" />
              End: {fmtDate(p.end_date)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Project image overlay badges ──────────────────────────────────────────────

function ProjectImageBadges({ project }: { project?: Project | null }) {
  if (!project?.is_featured && !project?.is_published) return null;
  return (
    <div className="absolute top-2.5 left-3 flex gap-2">
      {project?.is_featured && (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900">
          <Star className="w-2.5 h-2.5" />
          Featured
        </span>
      )}
      {project?.is_published && (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-[#030712]">
          <Globe className="w-2.5 h-2.5" />
          Published
        </span>
      )}
    </div>
  );
}

// ── Info item ─────────────────────────────────────────────────────────────────

function InfoItem({
  label,
  value,
  icon,
  warn,
  muted,
  hint,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  warn?: boolean;
  muted?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-[#9CA3AF] mb-0.5 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p
        className={`text-[13px] font-medium leading-snug ${
          warn ? "text-amber-600" : muted ? "text-[#9CA3AF]" : "text-[#030712]"
        }`}
      >
        {value}
      </p>
      {hint && <p className="text-[10px] mt-0.5 text-amber-500">{hint}</p>}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] text-[#9CA3AF]">{label}</p>
        <div className="w-6 h-6 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-xl font-semibold text-[#030712] truncate">{value}</p>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
        <Folders className="w-7 h-7 text-[#D1D5DB]" />
      </div>
      <h3 className="text-sm font-semibold text-[#030712] mb-1">
        No memberships found
      </h3>
      <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
        You haven't been added to any projects yet, or no memberships match the
        selected filter.
      </p>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  page,
  perPage,
  total,
  dataLength,
  onNext,
  onPrev,
  onPageChange,
}: {
  page: number;
  perPage: number;
  total?: number;
  dataLength: number;
  onNext: () => void;
  onPrev: () => void;
  onPageChange?: (page: number) => void;
}) {
  const totalPages = total ? Math.ceil(total / perPage) : undefined;
  const hasNext = total ? page < totalPages! : dataLength === perPage;

  const getPages = (): (number | "...")[] => {
    if (!totalPages) return [];
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex flex-col w-full md:flex-row items-center justify-between mt-2 gap-4 md:gap-0">
      {total && (
        <p className="text-sm text-[#9CA3AF]">
          Page <span className="font-medium text-[#374151]">{page}</span> of{" "}
          <span className="font-medium text-[#374151]">{totalPages}</span>{" "}
          &mdash; <span className="font-medium text-[#374151]">{total}</span>{" "}
          results
        </p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="px-3 py-1.5 flex items-center gap-1 rounded-lg border border-[#E5E7EB] text-xs font-medium bg-white text-[#374151] hover:bg-[#F9FAFB] transition disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Prev
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`e-${idx}`} className="px-1 text-[#9CA3AF] text-xs">
              …
            </span>
          ) : (
            <button
              key={`p-${p}`}
              onClick={() => onPageChange?.(p as number)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                p === page
                  ? "bg-[#068847] text-white border-[#068847]"
                  : "bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F9FAFB]"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="px-3 py-1.5 flex items-center gap-1 rounded-lg border border-[#E5E7EB] text-xs font-medium bg-white text-[#374151] hover:bg-[#F9FAFB] transition disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
