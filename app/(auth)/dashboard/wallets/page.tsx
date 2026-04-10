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
} from "lucide-react";
import { useState } from "react";
import {
  TransactionStatus,
  TransactionType,
  Wallet, // ← Wallet type interface
  WalletTransaction,
} from "@/lib/types/admin/walletsType";
import {
  useMyWallet,
  useMyWalletTransactions,
} from "@/lib/hooks/user/useWallet";
import MembershipFeePayment from "@/components/dashboard/wallet/MembershipFeePayment";

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
  const { data: profile, isLoading: walletLoading } = useMyWallet();
  const { data: transactionsData, isLoading: txLoading } =
    useMyWalletTransactions();
  const [filter, setFilter] = useState<FilterKey>("all");

  const isLoading = walletLoading || txLoading;

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
  const wallet: Wallet | null = profile ?? null; // profile is Wallet ✅
  const allTransactions: WalletTransaction[] = transactionsData ?? []; // transactionsData is WalletTransaction[] ✅

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
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Page title ── */}
        <div>
          <h1 className="text-2xl font-bold text-[#030712]">My Wallet</h1>
          <p className="text-[14px] text-[#6B7280] mt-1">
            Manage your balance, view statistics, and track transaction history
          </p>
        </div>

        {/* ── Locked warning ── */}
        {wallet?.is_locked && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
            <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-red-800 mb-1">
                Wallet Locked
              </p>
              <p className="text-[14px] text-red-700">
                {wallet.lock_reason ??
                  "Your wallet has been locked. Please contact support for assistance."}
                {wallet.locked_at && (
                  <span className="ml-1 text-red-600">
                    · Locked since {fmtDateTime(wallet.locked_at)}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left (2/3) ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Membership Fee Payment */}
            <MembershipFeePayment />

            {/* Balance hero */}
            <div className="bg-gradient-to-br from-[#068847] to-[#057a3d] rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-lg">
              <div className="px-6 md:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <WalletIcon className="w-7 h-7 text-white" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-full ${
                      wallet?.is_locked
                        ? "bg-red-500 text-white"
                        : "bg-white/20 text-white backdrop-blur-sm"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        wallet?.is_locked ? "bg-white" : "bg-emerald-300"
                      }`}
                    />
                    {wallet?.is_locked ? "Locked" : "Active"}
                  </span>
                </div>

                <div>
                  <p className="text-[14px] text-white/80 mb-2">
                    Total Available Balance
                  </p>
                  <p className="text-4xl font-bold text-white font-mono mb-6">
                    ৳{fmtAmount(totalBalance)}
                  </p>
                </div>

                {/* Balance breakdown tiles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20">
                    <p className="text-[13px] text-white/70 mb-1">
                      Main Balance
                    </p>
                    <p className="text-xl font-bold text-white font-mono">
                      {/* ৳{fmtAmount(wallet?.balance ?? "0")} */}
                      ৳{fmtAmount(wallet?.total_pension_paid)}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20">
                    <p className="text-[13px] text-white/70 mb-1">
                      Commission Balance
                    </p>
                    <p className="text-xl font-bold text-white font-mono">
                      ৳{fmtAmount(wallet?.commission_balance ?? "0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction history */}
            <Section
              icon={<TrendingUp className="w-5 h-5 text-[#068847]" />}
              title="Transaction History"
              badge={`${allTransactions.length} total`}
            >
              {/* Filter pills */}
              <div className="flex items-center gap-2 px-6 pt-4 pb-4 border-b border-[#F3F4F6] flex-wrap">
                {FILTERS.map(({ key, label }) => {
                  const count = countFor(key);
                  return (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`text-[13px] font-medium px-4 py-2 rounded-lg border transition-all ${
                        filter === key
                          ? "bg-[#068847] text-white border-[#068847] shadow-sm"
                          : "bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]"
                      }`}
                    >
                      {label}
                      {key !== "all" && count > 0 && (
                        <span className="ml-1.5 opacity-70">({count})</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
                    <WalletIcon className="w-7 h-7 text-[#D1D5DB]" />
                  </div>
                  <p className="text-[15px] font-semibold text-[#030712] mb-2">
                    No Transactions Found
                  </p>
                  <p className="text-[14px] text-[#6B7280] max-w-sm leading-relaxed">
                    {filter === "all"
                      ? "Your wallet activity will appear here once you make a deposit, payment, or receive a commission."
                      : `No ${filter} transactions found. Try adjusting your filters.`}
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
          <div className="space-y-6">
            {/* Statistics */}
            <Section
              icon={<TrendingUp className="w-5 h-5 text-[#068847]" />}
              title="Statistics"
            >
              <div className="px-6 py-3">
                <StatRow
                  label="Total Deposited"
                  value={wallet?.total_deposited}
                />
                <StatRow
                  label="Total Withdrawn"
                  value={wallet?.total_withdrawn}
                />
                <StatRow
                  label="Commission Earned"
                  value={wallet?.total_commission_earned}
                />
                <StatRow
                  label="Membership Paid"
                  value={wallet?.total_membership_paid}
                />
                <StatRow
                  label="Pension Paid"
                  value={wallet?.total_pension_paid}
                />
              </div>
            </Section>

            {/* Wallet meta */}
            <Section
              icon={<WalletIcon className="w-5 h-5 text-[#068847]" />}
              title="Wallet Information"
            >
              <div className="px-6 py-3">
                <InfoRow
                  label="Wallet ID"
                  value={wallet ? `#${wallet.id}` : null}
                  mono
                />
                <InfoRow label="Created" value={fmtDate(wallet?.created_at)} />
                <InfoRow
                  label="Last Updated"
                  value={fmtDate(wallet?.updated_at)}
                />
                <InfoRow
                  label="Status"
                  value={wallet?.is_locked ? "Locked" : "Active"}
                />
                {wallet?.is_locked && wallet.locked_at && (
                  <InfoRow
                    label="Locked On"
                    value={fmtDateTime(wallet.locked_at)}
                  />
                )}
                {wallet?.is_locked && wallet.lock_reason && (
                  <InfoRow label="Lock Reason" value={wallet.lock_reason} />
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
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-[#F9FAFB] transition-colors">
      {/* Direction icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isCredit ? "bg-emerald-50" : "bg-red-50"
        }`}
      >
        {isCredit ? (
          <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
        ) : (
          <ArrowUpRight className="w-5 h-5 text-red-500" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-[14px] font-semibold text-[#030712] truncate">
            {CATEGORY_LABELS[tx.category]}
          </p>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full ${sc.cls}`}
          >
            {sc.icon}
            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
          </span>
        </div>

        <p className="text-[12px] text-[#9CA3AF] font-mono mb-1">
          {tx.transaction_id}
        </p>

        {tx.description && (
          <p className="text-[13px] text-[#6B7280] mt-1 line-clamp-1">
            {tx.description}
          </p>
        )}

        <p className="text-[12px] text-[#9CA3AF] mt-1.5">
          {fmtDateTime(tx.created_at)}
          {tx.processed_at && tx.processed_at !== tx.created_at && (
            <span className="ml-1.5">
              · Processed {fmtDateTime(tx.processed_at)}
            </span>
          )}
        </p>
      </div>

      {/* Amount + running balance */}
      <div className="text-right flex-shrink-0">
        <p
          className={`text-[15px] font-bold font-mono ${
            isCredit ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isCredit ? "+" : "-"}৳{fmtAmount(tx.amount)}
        </p>
        <p className="text-[12px] text-[#9CA3AF] mt-1 font-mono">
          Balance: ৳{fmtAmount(tx.balance_after)}
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
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#F3F4F6] bg-[#FAFAFA]">
        <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-[15px] font-semibold text-[#030712]">{title}</h3>
        {badge !== undefined && (
          <span className="ml-auto text-[12px] font-medium px-3 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-full font-mono">
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
    <div className="flex items-start justify-between py-3 border-b border-[#F3F4F6] last:border-0 gap-4">
      <span className="text-[13px] text-[#6B7280] flex-shrink-0 pt-px">
        {label}
      </span>
      <span className="text-[14px] text-[#030712] font-semibold font-mono text-right">
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
    <div className="flex items-start justify-between py-3 border-b border-[#F3F4F6] last:border-0 gap-4">
      <span className="text-[13px] text-[#6B7280] flex-shrink-0 pt-px">
        {label}
      </span>
      <span
        className={`text-[14px] text-[#030712] font-medium text-right ${
          mono ? "font-mono" : ""
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value ?? <span className="text-[#D1D5DB] font-normal">—</span>}
      </span>
    </div>
  );
}
