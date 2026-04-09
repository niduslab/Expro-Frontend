"use client";
import {
  Wallet as WalletIcon, // from lucide-react (icon)
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldAlert,
  TrendingUp,
  Landmark,
} from "lucide-react";
import { useState } from "react";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";
import {
  TransactionStatus,
  TransactionType,
  Wallet, // ← Wallet type interface
  WalletTransaction,
} from "@/lib/types/admin/walletsType";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const fmtDateTime = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

const fmtAmount = (v: string | number) =>
  parseFloat(String(v)).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const CATEGORY_LABELS: Record<WalletTransaction["category"], string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  membership_fee: "Membership fee",
  pension_installment: "Pension installment",
  joining_commission: "Joining commission",
  installment_commission: "Installment commission",
  team_commission: "Team commission",
  executive_commission: "Executive commission",
  refund: "Refund",
  adjustment: "Adjustment",
  transfer_in: "Transfer in",
  transfer_out: "Transfer out",
  renewal_fee: "Renewal fee",
};

type FilterKey = "all" | TransactionType | TransactionStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "credit", label: "Credit" },
  { key: "debit", label: "Debit" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "failed", label: "Failed" },
  { key: "reversed", label: "Reversed" },
];

const STATUS_CONFIG: Record<
  TransactionStatus,
  { icon: React.ReactNode; cls: string }
> = {
  completed: {
    icon: <CheckCircle2 className="w-3 h-3" />,
    cls: "bg-emerald-50 text-emerald-700",
  },
  pending: {
    icon: <Clock className="w-3 h-3" />,
    cls: "bg-amber-50 text-amber-700",
  },
  failed: {
    icon: <XCircle className="w-3 h-3" />,
    cls: "bg-red-50 text-red-700",
  },
  reversed: {
    icon: <RotateCcw className="w-3 h-3" />,
    cls: "bg-gray-100 text-gray-600",
  },
};

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */

export default function WalletPage() {
  const { data: profile, isLoading } = useMyProfile();
  const [filter, setFilter] = useState<FilterKey>("all");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#068847] mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">Loading wallet…</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // wallet is a single object on the profile (not an array)
  const wallet: Wallet | null = profile.wallet?.[0] ?? null;
  const allTransactions: WalletTransaction[] =
    profile.wallet_transactions ?? [];
  const pensionEnrollments: any[] = profile.pension_enrollments ?? [];

  const filteredTransactions = allTransactions.filter((tx) => {
    if (filter === "all") return true;
    if (filter === "credit" || filter === "debit") return tx.type === filter;
    return tx.status === filter;
  });

  const countFor = (key: FilterKey) =>
    key === "all"
      ? allTransactions.length
      : allTransactions.filter((tx) =>
          key === "credit" || key === "debit"
            ? tx.type === key
            : tx.status === key,
        ).length;

  const totalBalance =
    parseFloat(wallet?.balance ?? "0") +
    parseFloat(wallet?.commission_balance ?? "0");

  return (
    <div className="container mx-auto mb-4">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* ── Page title ── */}
        <div>
          <h1 className="text-lg font-semibold text-[#030712]">Wallet</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Your balance, statistics, and transaction history
          </p>
        </div>

        {/* ── Locked warning ── */}
        {wallet?.is_locked && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-red-800 mb-0.5">
                Wallet locked
              </p>
              <p className="text-xs text-red-700">
                {wallet.lock_reason ??
                  "Your wallet has been locked. Please contact support."}
                {wallet.locked_at && (
                  <span className="ml-1 text-red-500">
                    · Since {fmtDateTime(wallet.locked_at)}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left (2/3) ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Balance hero — mirrors the profile page green band pattern */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <div className="h-20 bg-[#068847] relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/[0.06]" />
                <div className="absolute top-3 right-20 w-16 h-16 rounded-full bg-white/[0.06]" />
              </div>

              <div className="px-5 md:px-6 pb-5 -mt-8">
                <div className="w-16 h-16 rounded-2xl bg-[#068847] border-4 border-white flex items-center justify-center mb-4">
                  <WalletIcon className="w-7 h-7 text-white" />
                </div>

                <div className="flex items-end justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">
                      Total available
                    </p>
                    <p className="text-3xl font-semibold text-[#030712] font-mono">
                      ৳{fmtAmount(totalBalance)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      wallet?.is_locked
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        wallet?.is_locked ? "bg-red-500" : "bg-emerald-500"
                      }`}
                    />
                    {wallet?.is_locked ? "Locked" : "Unlocked"}
                  </span>
                </div>

                {/* Balance breakdown tiles */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-[#F9FAFB] rounded-xl px-4 py-3 border border-[#F3F4F6]">
                    <p className="text-[11px] text-[#9CA3AF] mb-1">
                      Main balance
                    </p>
                    <p className="text-lg font-semibold text-[#030712] font-mono">
                      ৳{fmtAmount(wallet?.balance ?? "0")}
                    </p>
                  </div>
                  <div className="bg-[#F9FAFB] rounded-xl px-4 py-3 border border-[#F3F4F6]">
                    <p className="text-[11px] text-[#9CA3AF] mb-1">
                      Commission balance
                    </p>
                    <p className="text-lg font-semibold text-[#030712] font-mono">
                      ৳{fmtAmount(wallet?.commission_balance ?? "0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction history */}
            <Section
              icon={<TrendingUp className="w-4 h-4 text-[#068847]" />}
              title="Transaction history"
              badge={`${allTransactions.length} records`}
            >
              {/* Filter pills */}
              <div className="flex items-center gap-2 px-5 pt-3 pb-3 border-b border-[#F3F4F6] flex-wrap">
                {FILTERS.map(({ key, label }) => {
                  const count = countFor(key);
                  return (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`text-[11px] font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        filter === key
                          ? "bg-[#068847] text-white border-[#068847]"
                          : "bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {label}
                      {key !== "all" && count > 0 && (
                        <span className="ml-1 opacity-60">({count})</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-3">
                    <WalletIcon className="w-5 h-5 text-[#D1D5DB]" />
                  </div>
                  <p className="text-sm font-semibold text-[#030712] mb-1">
                    No transactions
                  </p>
                  <p className="text-xs text-[#6B7280] max-w-xs leading-relaxed">
                    {filter === "all"
                      ? "Your wallet activity will appear here once you make a deposit, payment, or receive a commission."
                      : `No ${filter} transactions found.`}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F3F4F6]">
                  {filteredTransactions.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* ── Right (1/3) ── */}
          <div className="space-y-5">
            {/* Statistics — exactly the 5 fields on the Wallet type */}
            <Section
              icon={<TrendingUp className="w-4 h-4 text-[#068847]" />}
              title="Statistics"
            >
              <div className="px-5 py-2">
                <StatRow
                  label="Total deposited"
                  value={wallet?.total_deposited}
                />
                <StatRow
                  label="Total withdrawn"
                  value={wallet?.total_withdrawn}
                />
                <StatRow
                  label="Commission earned"
                  value={wallet?.total_commission_earned}
                />
                <StatRow
                  label="Membership paid"
                  value={wallet?.total_membership_paid}
                />
                <StatRow
                  label="Pension paid"
                  value={wallet?.total_pension_paid}
                />
              </div>
            </Section>

            {/* Pension enrollments */}
            <Section
              icon={<Landmark className="w-4 h-4 text-[#068847]" />}
              title="Pension enrollments"
              badge={String(pensionEnrollments.length)}
            >
              {pensionEnrollments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-3">
                    <Landmark className="w-5 h-5 text-[#D1D5DB]" />
                  </div>
                  <p className="text-xs font-semibold text-[#030712] mb-1">
                    No pension plan
                  </p>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">
                    Contact your branch to enroll in a pension plan.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F3F4F6]">
                  {pensionEnrollments.map((pe: any) => (
                    <div key={pe.id} className="px-5 py-3">
                      <p className="text-xs font-semibold text-[#030712]">
                        {pe.plan_name ?? `Plan #${pe.id}`}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                        Since {fmtDate(pe.enrolled_at ?? pe.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Wallet meta */}
            <Section
              icon={<WalletIcon className="w-4 h-4 text-[#068847]" />}
              title="Wallet info"
            >
              <div className="px-5 py-2">
                <InfoRow
                  label="Wallet ID"
                  value={wallet ? `#${wallet.id}` : null}
                  mono
                />
                <InfoRow label="Created" value={fmtDate(wallet?.created_at)} />
                <InfoRow
                  label="Last updated"
                  value={fmtDate(wallet?.updated_at)}
                />
                <InfoRow
                  label="Status"
                  value={wallet?.is_locked ? "Locked" : "Active"}
                />
                {wallet?.is_locked && wallet.locked_at && (
                  <InfoRow
                    label="Locked on"
                    value={fmtDateTime(wallet.locked_at)}
                  />
                )}
                {wallet?.is_locked && wallet.lock_reason && (
                  <InfoRow label="Lock reason" value={wallet.lock_reason} />
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TransactionRow
───────────────────────────────────────── */

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const isCredit = tx.type === "credit";
  const sc = STATUS_CONFIG[tx.status];

  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      {/* Direction icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isCredit ? "bg-emerald-50" : "bg-red-50"
        }`}
      >
        {isCredit ? (
          <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
        ) : (
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="text-xs font-semibold text-[#030712] truncate">
            {CATEGORY_LABELS[tx.category]}
          </p>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${sc.cls}`}
          >
            {sc.icon}
            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
          </span>
        </div>

        <p className="text-[11px] text-[#9CA3AF] font-mono">
          {tx.transaction_id}
        </p>

        {tx.description && (
          <p className="text-[11px] text-[#6B7280] mt-0.5 truncate">
            {tx.description}
          </p>
        )}

        <p className="text-[10px] text-[#9CA3AF] mt-0.5">
          {fmtDateTime(tx.created_at)}
          {tx.processed_at && tx.processed_at !== tx.created_at && (
            <span className="ml-1">
              · processed {fmtDateTime(tx.processed_at)}
            </span>
          )}
        </p>
      </div>

      {/* Amount + running balance */}
      <div className="text-right flex-shrink-0">
        <p
          className={`text-sm font-semibold font-mono ${
            isCredit ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isCredit ? "+" : "-"}৳{fmtAmount(tx.amount)}
        </p>
        <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-mono">
          bal ৳{fmtAmount(tx.balance_after)}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Shared sub-components
───────────────────────────────────────── */

function Section({
  icon,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#F3F4F6]">
        <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-[#030712]">{title}</h3>
        {badge !== undefined && (
          <span className="ml-auto text-[11px] font-medium px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] rounded-full font-mono">
            {badge}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[#F3F4F6] last:border-0 gap-4">
      <span className="text-[11px] text-[#9CA3AF] flex-shrink-0 pt-px">
        {label}
      </span>
      <span className="text-[13px] text-[#030712] font-medium font-mono text-right">
        ৳{fmtAmount(value ?? "0")}
      </span>
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
  value?: string | null;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[#F3F4F6] last:border-0 gap-4">
      <span className="text-[11px] text-[#9CA3AF] flex-shrink-0 pt-px">
        {label}
      </span>
      <span
        className={`text-[13px] text-[#030712] font-medium text-right ${
          mono ? "font-mono" : ""
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value ?? <span className="text-[#D1D5DB] font-normal">—</span>}
      </span>
    </div>
  );
}
