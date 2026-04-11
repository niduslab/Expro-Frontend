"use client";

import Link from "next/link";
import {
  Lock,
  Shield,
  MonitorSmartphone,
  User,
  Mail,
  Trash2,
  Bell,
  Sun,
  Globe,
  FileText,
  ChevronRight,
  Settings,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface SettingCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  tag: string;
  tagColor: string;
  tagBorder: string;
  tagBg: string;
  href: string;
  accentLeft?: boolean;
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const SECURITY_CARDS: SettingCard[] = [
  {
    title: "Change password",
    description: "Update your login password and keep your account secure.",
    icon: <Lock className="h-4 w-4" />,
    iconBg: "bg-orange-50",
    iconBorder: "border-orange-300",
    iconColor: "text-orange-500",
    tag: "Security",
    tagColor: "text-gray-700",
    tagBorder: "border-gray-300",
    tagBg: "bg-white",
    href: "/admin/settings/change-password",
  },
  {
    title: "Two-factor authentication",
    description: "Add an extra layer of protection with 2FA via SMS or app.",
    icon: <Shield className="h-4 w-4" />,
    iconBg: "bg-red-50",
    iconBorder: "border-red-200",
    iconColor: "text-red-500",
    tag: "Security",
    tagColor: "text-red-600",
    tagBorder: "border-red-300",
    tagBg: "bg-white",
    href: "/settings/two-factor",
  },
  {
    title: "Active sessions",
    description: "View and revoke active login sessions across your devices.",
    icon: <MonitorSmartphone className="h-4 w-4" />,
    iconBg: "bg-gray-50",
    iconBorder: "border-gray-200",
    iconColor: "text-gray-500",
    tag: "Security",
    tagColor: "text-gray-700",
    tagBorder: "border-gray-300",
    tagBg: "bg-white",
    href: "/settings/sessions",
  },
];

const ACCOUNT_CARDS: SettingCard[] = [
  {
    title: "Profile information",
    description: "Update your name, photo, and contact details.",
    icon: <User className="h-4 w-4" />,
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-200",
    iconColor: "text-blue-500",
    tag: "Account",
    tagColor: "text-[#068847]",
    tagBorder: "border-[#068847]",
    tagBg: "bg-white",
    href: "/settings/profile",
    accentLeft: true,
  },
  {
    title: "Email address",
    description: "Change or verify the email linked to your account.",
    icon: <Mail className="h-4 w-4" />,
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-200",
    iconColor: "text-blue-500",
    tag: "Account",
    tagColor: "text-[#068847]",
    tagBorder: "border-[#068847]",
    tagBg: "bg-white",
    href: "/settings/email",
  },
  {
    title: "Delete account",
    description: "Permanently remove your account and all associated data.",
    icon: <Trash2 className="h-4 w-4" />,
    iconBg: "bg-red-50",
    iconBorder: "border-red-200",
    iconColor: "text-red-500",
    tag: "Danger zone",
    tagColor: "text-red-600",
    tagBorder: "border-red-400",
    tagBg: "bg-white",
    href: "/settings/delete-account",
  },
];

const PREFERENCE_CARDS: SettingCard[] = [
  {
    title: "Notifications",
    description: "Control email and in-app notification preferences.",
    icon: <Bell className="h-4 w-4" />,
    iconBg: "bg-gray-50",
    iconBorder: "border-gray-200",
    iconColor: "text-gray-500",
    tag: "Preferences",
    tagColor: "text-gray-700",
    tagBorder: "border-gray-300",
    tagBg: "bg-white",
    href: "/settings/notifications",
  },
  {
    title: "Appearance",
    description: "Switch between light, dark, or system theme.",
    icon: <Sun className="h-4 w-4" />,
    iconBg: "bg-green-50",
    iconBorder: "border-green-200",
    iconColor: "text-[#068847]",
    tag: "Preferences",
    tagColor: "text-[#068847]",
    tagBorder: "border-[#068847]",
    tagBg: "bg-[#F0FDF4]",
    href: "/settings/appearance",
  },
  {
    title: "Language & region",
    description: "Set your preferred language, timezone, and date format.",
    icon: <Globe className="h-4 w-4" />,
    iconBg: "bg-gray-50",
    iconBorder: "border-gray-200",
    iconColor: "text-gray-500",
    tag: "Preferences",
    tagColor: "text-gray-700",
    tagBorder: "border-gray-300",
    tagBg: "bg-white",
    href: "/settings/language",
  },
  {
    title: "Activity log",
    description: "Review a full history of your account activity and logins.",
    icon: <FileText className="h-4 w-4" />,
    iconBg: "bg-green-50",
    iconBorder: "border-green-200",
    iconColor: "text-[#068847]",
    tag: "Account",
    tagColor: "text-[#068847]",
    tagBorder: "border-[#068847]",
    tagBg: "bg-[#F0FDF4]",
    href: "/settings/activity",
  },
];

// ─────────────────────────────────────────────
// SettingCardItem
// ─────────────────────────────────────────────
function SettingCardItem({ card }: { card: SettingCard }) {
  return (
    <Link
      href={card.href}
      className={[
        "group relative bg-white rounded-xl flex flex-col justify-between p-5 min-h-[160px]",
        "hover:border-[#068847] transition-colors duration-150",
        card.accentLeft
          ? "border border-[#E5E7EB] border-l-[3px] border-l-[#068847]"
          : "border border-[#E5E7EB]",
      ].join(" ")}
    >
      {/* Top section: icon + title + description */}
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${card.iconBg} ${card.iconBorder} ${card.iconColor}`}
        >
          {card.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-[#111827] leading-snug">
            {card.title}
          </p>
          <p className="text-[13px] text-[#6B7280] mt-1.5 leading-[1.55]">
            {card.description}
          </p>
        </div>
      </div>

      {/* Bottom section: tag pill + chevron */}
      <div className="flex items-center justify-between mt-5">
        <span
          className={`text-[12px] font-medium px-3 py-[3px] rounded-full border ${card.tagBg} ${card.tagColor} ${card.tagBorder}`}
        >
          {card.tag}
        </span>
        <ChevronRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#068847] transition-colors" />
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────
function Section({ label, cards }: { label: string; cards: SettingCard[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">
        {label}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {cards.map((card) => (
          <SettingCardItem key={card.href} card={card} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      <div className="bg-white border-b border-[#e8e6e0] max-w-7xl mx-auto py-6 space-y-6">
        {/* ── Page Header ── */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-[52px] h-[52px]  bg-[#F0FDF4]  flex items-center justify-center flex-shrink-0">
              <Settings className="h-6 w-6 text-[#068847]" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#111827] leading-tight">
                Settings
              </h1>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                Manage your account, security, and preferences
              </p>
            </div>
          </div>
        </div>

        {/* ── Sections ── */}
        <Section label="Security" cards={SECURITY_CARDS} />
        <Section label="Account" cards={ACCOUNT_CARDS} />
        <Section label="Preferences" cards={PREFERENCE_CARDS} />
      </div>
    </div>
  );
}
