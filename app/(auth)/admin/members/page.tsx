"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMembers, Member } from "@/lib/hooks/admin/useMembers";
import { usePensionPackages } from "@/lib/hooks/admin/usePensionPackages";
import PensionRoleModal from "./pensionRoleModal";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "active" | "pending" | "inactive" | "suspended";
type MemberType = "executive" | "general";
type SortKey = "name" | "status" | "balance" | "joined";
type SortDir = "asc" | "desc";

const AVATAR_COLORS = [
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#E1F5EE", color: "#0F6E56" },
  { bg: "#FAECE7", color: "#993C1D" },
  { bg: "#E6F1FB", color: "#185FA5" },
  { bg: "#FAEEDA", color: "#854F0B" },
  { bg: "#EAF3DE", color: "#3B6D11" },
  { bg: "#FBEAF0", color: "#993556" },
];

// ─── Small components ─────────────────────────────────────────────────────────
function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      style={{ background: c.bg, color: c.color }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0"
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const cfg: Record<Status, { dot: string; pill: string; label: string }> = {
    active: { dot: "bg-[#0D9488]", pill: "text-[#0D9488] bg-[#CCFBF1] border-[#CCFBF1]", label: "Active" },
    pending: { dot: "bg-[#F59E0B]", pill: "text-[#92400E] bg-[#FEF3C7] border-[#FEF3C7]", label: "Pending" },
    inactive: { dot: "bg-gray-600 font-[500]", pill: "text-gray-700 bg-[#F3F4F6] border-[#F3F4F6]", label: "Inactive" },
    suspended: { dot: "bg-[#DC2626]", pill: "text-[#991B1B] bg-[#FEE2E2] border-[#FEE2E2]", label: "Suspended" },
  };
  const s = cfg[status] ?? cfg.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium border px-2 py-0.5 rounded-full ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function TypeBadge({ type }: { type: MemberType }) {
  return type === "executive" ? (
    <span className="inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full text-[#6366F1] bg-[#E0E7FF] border border-[#E0E7FF]">
      Executive
    </span>
  ) : (
    <span className="inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full text-[#65A30D] bg-[#ECFCCB] border border-[#ECFCCB]">
      General
    </span>
  );
}

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function SortChevron({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={`ml-1 text-[10px] ${active ? "text-[#068847]" : "text-gray-300"}`}>
      {active && dir === "desc" ? "▼" : "▲"}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-[#F5F4ED] rounded-xl p-4">
      <p className="text-[14px] font-[600] text-black-700 mb-1">{label}</p>
      <p className={`text-[20px] font-[700] ${valueColor ?? "text-gray-900"}`}>{value}</p>
      <p className="text-[16px] font-[400] text-gray-600 mt-0.5">{sub}</p>
    </div>
  );
}

function IconBtn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <button
      title={title}
      className="w-[26px] h-[26px] rounded-lg border border-[#E5E7EB] bg-transparent flex items-center justify-center text-gray-700 hover:bg-[#F3F4F6] hover:text-gray-900 transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MembersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [typeFilter, setTypeFilter] = useState<MemberType | "">("");
  const [pensionFilter, setPensionFilter] = useState<number | "">("");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [editMemberId, setEditMemberId] = useState<number | null>(null);
  const [pensionRoleMember, setPensionRoleMember] = useState<{ id: number; name: string; enrollments: any[] } | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [enrollmentRoleFilter, setEnrollmentRoleFilter] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply pension package filter from URL params
  useEffect(() => {
    const packageId = searchParams.get('packageId');
    if (packageId) {
      setPensionFilter(Number(packageId));
    }
  }, [searchParams]);

  const { data: response, isLoading } = useMembers({
    page,
    per_page: perPage,
    search: search || undefined,
    status: statusFilter || undefined,
    pension_role: enrollmentRoleFilter || undefined, // Filter by enrollment role
  });

  // Fetch pension packages for filter
  const { data: pensionPackagesData } = usePensionPackages({ per_page: 100 });
  const pensionPackages = Array.isArray(pensionPackagesData?.data) 
    ? pensionPackagesData.data 
    : [];

  // Get package name from URL if filtering
  const packageNameFromUrl = searchParams.get('packageName');

  // Extract data from API response
  const paginatedData = response?.data;
  const rawMembers: Member[] = Array.isArray(paginatedData) ? paginatedData : (paginatedData?.data || []);
  
  // Filter out users without member data (incomplete registrations)
  const apiMembers = rawMembers.filter((m) => m.member !== null);
  
  const pagination = (paginatedData && !Array.isArray(paginatedData))
    ? paginatedData.pagination
    : { current_page: 1, last_page: 1, total: apiMembers.length, per_page: 50 };

  // ── Filter + sort logic ──
  const filtered = useMemo(() => {
    let list = apiMembers.filter((m) => {
      // Type filter
      if (typeFilter && m.member?.membership_type !== typeFilter) return false;
      
      // Pension package filter
      if (pensionFilter) {
        const hasPackage = m.pension_enrollments?.some(
          (enrollment: any) => enrollment.pension_package_id === pensionFilter
        );
        if (!hasPackage) return false;
      }
      
      return true;
    });

    // Sort
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        const nameA = a.member?.name_english || a.email || "";
        const nameB = b.member?.name_english || b.email || "";
        cmp = nameA.localeCompare(nameB);
      }
      if (sortKey === "status") {
        const statusA = a.status === "approved" ? "active" : a.status;
        const statusB = b.status === "approved" ? "active" : b.status;
        cmp = statusA.localeCompare(statusB);
      }
      if (sortKey === "balance") {
        const balA = parseFloat(a.wallet?.balance || "0");
        const balB = parseFloat(b.wallet?.balance || "0");
        cmp = balA - balB;
      }
      if (sortKey === "joined") {
        const dateA = new Date(a.member?.membership_date || a.member?.created_at || 0).getTime();
        const dateB = new Date(b.member?.membership_date || b.member?.created_at || 0).getTime();
        cmp = dateA - dateB;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [apiMembers, typeFilter, pensionFilter, sortKey, sortDir]);

  const members = filtered;

  // ── Selection ──
  const allPageSelected = members.length > 0 && members.every((m) => selected.has(m.id));

  function toggleAll() {
    if (allPageSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(members.map((m) => m.id)));
    }
  }

  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  // ── Sort toggle ──
  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // ── Stats ──
  const stats = {
    total: apiMembers.length,
    active: apiMembers.filter((m) => m.status === "active" || m.status === "approved").length,
    pending: apiMembers.filter((m) => m.status === "pending").length,
    totalWallet: apiMembers.reduce((sum, m) => {
      const balance = parseFloat(m.wallet?.balance || "0");
      return sum + balance;
    }, 0),
  };

  // ── Page window (shows 5 buttons around current page) ──
  function pageWindow(): number[] {
    const pages: number[] = [];
    const currentPage = pagination.current_page;
    const lastPage = pagination.last_page;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(lastPage, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1400px] mx-auto space-y-4">
        {/* ── Header ── */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-[22px] font-medium text-gray-900">Members</p>
              <p className="text-[13px] text-gray-700 mt-0.5">
                All registered members · Updated just now
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-[12px] px-3 py-[5px] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                <DownloadIcon /> Export CSV
              </button>
              <button className="flex items-center gap-1.5 text-[12px] px-3 py-[5px] bg-[#068847] text-white rounded-lg hover:bg-[#045a2e] transition-colors cursor-pointer">
                + Add Member
              </button>
            </div>
          </div>
          
          {/* Package Filter Badge */}
          {packageNameFromUrl && pensionFilter && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-lg">
              <span className="text-[13px] text-[#068847]">
                Filtering by pension package: <span className="font-semibold">{packageNameFromUrl}</span>
              </span>
              <button
                onClick={() => {
                  setPensionFilter("");
                  router.push('/admin/members');
                }}
                className="ml-auto text-[#068847] hover:text-[#045a2e] transition-colors"
                title="Clear filter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Members"
            value={stats.total.toLocaleString()}
            sub="+143 this month"
            valueColor="text-[#068847]"
          />
          <StatCard
            label="Active"
            value={stats.active.toString()}
            sub={`${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% of total`}
          />
          <StatCard
            label="Pending"
            value={stats.pending.toString()}
            sub="Awaiting approval"
            valueColor="text-[#BA7517]"
          />
          <StatCard
            label="Total Wallet"
            value={`৳${(stats.totalWallet / 1000).toFixed(1)}K`}
            sub="Across all accounts"
          />
        </div>

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-lg border border-[#E5E7EB]">
        <div className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 font-[500]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search name, ID, email, phone…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-3 py-[6px] text-[13px] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847]"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as Status | "");
                setPage(1);
              }}
              className="text-[12px] px-2 py-[5px] border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as MemberType | "");
                setPage(1);
              }}
              className="text-[12px] px-2 py-[5px] border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="executive">Executive</option>
              <option value="general">General</option>
            </select>

            <select
              value={pensionFilter}
              onChange={(e) => {
                setPensionFilter(e.target.value ? Number(e.target.value) : "");
                setPage(1);
              }}
              className="text-[12px] px-2 py-[5px] border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] cursor-pointer"
            >
              <option value="">All Packages</option>
              {pensionPackages.map((pkg: any) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>

            <select
              value={enrollmentRoleFilter}
              onChange={(e) => {
                setEnrollmentRoleFilter(e.target.value);
                setPage(1);
              }}
              className="text-[12px] px-2 py-[5px] border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="executive_member">Executive Member</option>
              <option value="project_presenter">Project Presenter</option>
              <option value="assistant_pp">Assistant PP</option>
            </select>

            {/*  */}

            <span className="text-[12px] text-gray-600 font-[500] ml-2 hidden sm:inline">
              Showing {members.length} of {stats.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#EAF3DE] border border-[#C0DD97] rounded-lg text-[13px] text-[#3B6D11]">
          <span className="font-medium">
            {selected.size} member{selected.size !== 1 ? "s" : ""} selected
          </span>
          <button className="text-[11px] px-3 py-1 border border-[#C0DD97] rounded-lg hover:bg-[#C0DD97]/30 transition-colors">
            Approve
          </button>
          <button className="text-[11px] px-3 py-1 border border-[#C0DD97] rounded-lg hover:bg-[#C0DD97]/30 transition-colors">
            Suspend
          </button>
          <button className="text-[11px] px-3 py-1 border border-[#F5C4B3] rounded-lg text-[#993C1D] hover:bg-[#F5C4B3]/30 transition-colors">
            Delete
          </button>
          <button
            onClick={clearSelection}
            className="ml-auto text-[12px] underline underline-offset-2 text-[#5F8C5A]"
          >
            Clear
          </button>
        </div>
      )}

      {/* ── Table ── */}
      {members.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center min-h-[300px] border border-[#E5E7EB] rounded-lg bg-white">
          <div className="text-center">
            <p className="text-[14px] text-gray-700">No members match your filters</p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setTypeFilter("");
                setPensionFilter("");
                setEnrollmentRoleFilter("");
              }}
              className="mt-2 text-[12px] text-[#068847] underline"
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              {/* ── Table Head ── */}
              <thead className="bg-[#F9FAFB] sticky top-0 z-10">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleAll}
                      className="accent-[#068847] cursor-pointer"
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-[11px] font-medium text-gray-700 uppercase tracking-wider cursor-pointer select-none hover:text-gray-900 transition-colors min-w-[200px]"
                    onClick={() => handleSort("name")}
                  >
                    Member <SortChevron active={sortKey === "name"} dir={sortDir} />
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-gray-700 uppercase tracking-wider min-w-[150px]">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    className="px-4 py-3 text-left text-[11px] font-medium text-gray-700 uppercase tracking-wider cursor-pointer select-none hover:text-gray-900 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    Status <SortChevron active={sortKey === "status"} dir={sortDir} />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-[11px] font-medium text-gray-700 uppercase tracking-wider cursor-pointer select-none hover:text-gray-900 transition-colors"
                    onClick={() => handleSort("balance")}
                  >
                    Wallet <SortChevron active={sortKey === "balance"} dir={sortDir} />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-[11px] font-medium text-gray-700 uppercase tracking-wider cursor-pointer select-none hover:text-gray-900 transition-colors"
                    onClick={() => handleSort("joined")}
                  >
                    Joined <SortChevron active={sortKey === "joined"} dir={sortDir} />
                  </th>
                  {/* <th className="px-4 py-3 text-left text-[11px] font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Enrollment Role
                  </th> */}
                  <th className="px-4 py-3 text-center text-[11px] font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* ── Table Body ── */}
              <tbody className="divide-y divide-[#F3F4F6]">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-700">
                      Loading members...
                    </td>
                  </tr>
                ) : (
                  members.map((member, index) => {
                    const isSelected = selected.has(member.id);
                    const memberName = member.member?.name_english || member.email || "Unknown";
                    const memberNameBangla = member.member?.name_bangla || "";
                    const memberId = member.member?.member_id || `USR-${String(member.id).padStart(5, "0")}`;
                    const memberPhone = member.member?.mobile || "N/A";
                    const memberType = (member.member?.membership_type || "general") as MemberType;
                    const memberProfile = member.member;
                    let displayStatus = member.status;
                    if (displayStatus === "approved") displayStatus = "active";
                    const memberStatus = displayStatus as Status;
                    const walletBalance = parseFloat(member.wallet?.balance || "0");
                    const pensionCount = member.pension_enrollments?.length || 0;
                    const joinDate = member.member?.membership_date || member.member?.created_at;
                    
                    // Get enrollment roles
                    const enrollmentRoles = member.pension_enrollments?.flatMap((enrollment: any) => 
                      enrollment.package_roles?.filter((role: any) => role.is_active).map((role: any) => role.role) || []
                    ) || [];
                    const uniqueRoles = [...new Set(enrollmentRoles)];

                    return (
                      <tr
                        key={member.id}
                        className={`transition-colors ${isSelected ? "bg-[#EAF3DE]" : "hover:bg-[#FAFAFA]"}`}
                      >
                        <td className="px-4 py-[9px]">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOne(member.id)}
                            className="accent-[#068847] cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-[9px]">
                          <div className="flex items-center gap-2.5">
                            {memberProfile?.photo ? (
                              <Image
                                src={
                                  memberProfile.photo.startsWith('http') 
                                    ? memberProfile.photo 
                                    : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${memberProfile.photo}`
                                }
                                alt={memberName}
                                width={32}
                                height={32}
                                className="rounded-full object-cover w-8 h-8 flex-shrink-0"
                                unoptimized
                              />
                            ) : (
                              <Avatar name={memberName} index={index} />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{memberName}</p>
                              <p className="text-[11px] text-gray-600 font-[500] truncate">
                                {memberId}
                                {memberNameBangla && ` · ${memberNameBangla}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-[9px]">
                          <p className="text-[12px] text-gray-900">{memberPhone}</p>
                          <p className="text-[11px] text-gray-600 font-[500]">{member.email}</p>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-2">
                            <TypeBadge type={memberType} />
                            {uniqueRoles.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {uniqueRoles.map((role: string) => {
                                  const roleConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
                                    executive_member: { label: "Executive Member", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
                                    project_presenter: { label: "Project Presenter", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
                                    assistant_pp: { label: "Assistant PP", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
                                    general_member: { label: "General Member", bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
                                  };
                                  const config = roleConfig[role] || { 
                                    label: role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
                                    bg: "bg-gray-100", 
                                    text: "text-gray-700", 
                                    border: "border-gray-200" 
                                  };
                                  return (
                                    <span
                                      key={role}
                                      className={`inline-flex items-center justify-start h-6 px-2.5 w-full text-[11px] font-medium rounded-full border whitespace-nowrap ${config.bg} ${config.text} ${config.border}`}
                                    >
                                      {config.label}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-[9px]">
                          <StatusBadge status={memberStatus} />
                        </td>
                        <td className="px-4 py-[9px]">
                          <p className="text-[12px] font-medium text-gray-900">
                            ৳{walletBalance.toLocaleString()}
                          </p>
                          <p className="text-[11px] text-gray-600 font-[500]">
                            {pensionCount} plan{pensionCount !== 1 ? "s" : ""}
                          </p>
                        </td>
                        <td className="px-4 py-[9px] text-[12px] text-gray-700">
                          {joinDate
                            ? new Date(joinDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        {/* <td className="px-4 py-[9px]">
                          
                        </td> */}
                        <td className="px-4 py-[9px]">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => router.push(`/admin/members/${member.id}`)}
                              title="View profile"
                              className="w-[26px] h-[26px] rounded-lg border border-[#E5E7EB] bg-transparent flex items-center justify-center text-gray-700 hover:bg-[#F0FDF4] hover:text-[#068847] hover:border-[#068847] transition-colors cursor-pointer"
                            >
                              <EyeIcon />
                            </button>
                            <button
                              onClick={() => setEditMemberId(member.id)}
                              title="Edit"
                              className="w-[26px] h-[26px] rounded-lg border border-[#E5E7EB] bg-transparent flex items-center justify-center text-gray-700 hover:bg-[#F3F4F6] hover:text-gray-900 transition-colors cursor-pointer"
                            >
                              <EditIcon />
                            </button>
                            
                            {/* More Actions Dropdown */}
                            <div className="relative" ref={openDropdownId === member.id ? dropdownRef : null}>
                              <button
                                onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                                title="More actions"
                                className="w-[26px] h-[26px] rounded-lg border border-[#E5E7EB] bg-transparent flex items-center justify-center text-gray-700 hover:bg-[#F3F4F6] hover:text-gray-900 transition-colors cursor-pointer"
                              >
                                <MoreIcon />
                              </button>
                              
                              {openDropdownId === member.id && (
                                <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-50">
                                  <button
                                    onClick={() => {
                                      setPensionRoleMember({
                                        id: member.id,
                                        name: memberName,
                                        enrollments: member.pension_enrollments || []
                                      });
                                      setOpenDropdownId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#030712] hover:bg-[#F9FAFB] flex items-center gap-2 transition-colors"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                    Pension Role
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB] flex-wrap gap-3">
            <p className="text-[12px] text-gray-700">
              Page {pagination.current_page} of {pagination.last_page} · {stats.total.toLocaleString()} results
            </p>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, pagination.current_page - 1))}
                disabled={pagination.current_page === 1}
                className="h-7 px-2 text-[12px] border border-[#E5E7EB] rounded-lg disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                ‹
              </button>

              {pageWindow().map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-[12px] rounded-lg border transition-colors cursor-pointer ${
                    p === pagination.current_page
                      ? "bg-[#068847] text-white border-[#068847]"
                      : "border-[#E5E7EB] hover:bg-[#F3F4F6] text-gray-900"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage(Math.min(pagination.last_page, pagination.current_page + 1))}
                disabled={pagination.current_page === pagination.last_page}
                className="h-7 px-2 text-[12px] border border-[#E5E7EB] rounded-lg disabled:opacity-40 hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                ›
              </button>
            </div>

            {/* Per page selector */}
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="text-[12px] px-2 py-1 border border-[#E5E7EB] rounded-lg bg-white focus:outline-none cursor-pointer"
            >
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
              <option value={200}>200 / page</option>
            </select>
          </div>
        </div>
      )}

      {/* Member Edit Modal - TODO: Create edit modal component */}
      {editMemberId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#030712] mb-4">Edit Member</h3>
              <p className="text-[#4A5565] mb-6">Edit functionality will be implemented here</p>
              <button
                onClick={() => setEditMemberId(null)}
                className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pension Role Modal */}
      {pensionRoleMember && (
        <PensionRoleModal
          isOpen={!!pensionRoleMember}
          onClose={() => setPensionRoleMember(null)}
          memberId={pensionRoleMember.id}
          memberName={pensionRoleMember.name}
          pensionEnrollments={pensionRoleMember.enrollments}
        />
      )}
      </div>
    </div>
  );
}
