"use client";

import React, { useEffect } from "react";
import {
  LogOut,
  Settings,
  X,
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  ShieldCheck,
  FolderKanban,
  Wallet,
  Percent,
  HeartHandshake,
  GitBranch,
  BookOpen,
  CalendarDays,
  Image as ImageIcon,
  Banknote,
  Split,
  NotebookPen,
  Balloon,
  Images,
  Hd,
  FilePlusCorner,
  UsersRound,
  Activity,
  MessageSquareShare,
  SquareChartGantt,
  AudioLines,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LogoutButton } from "./LogoutButton";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin?: boolean;
}

// ---------------------------------------------------------------------------
// Mock item lists (replace with your real imports)
// ---------------------------------------------------------------------------
const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pension Packages", href: "/admin/pension-packages", icon: Package },

  { name: "Manage Members", href: "/admin/members", icon: SquareChartGantt },
  {
    name: "Membership Request",
    href: "/admin/membership-request",
    icon: AudioLines,
  },
  {
    name: "Role Permission",
    href: "/admin/role-permission",
    icon: ShieldCheck,
  },
  // { name: "All Pension Members", href: "/admin/members", icon: Users },

  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Wallet Balance", href: "/admin/wallet", icon: Wallet },
  { name: "Commission", href: "/admin/commission", icon: Percent },
  { name: "Donation", href: "/admin/donation", icon: Banknote },

  { name: "Branch", href: "/admin/branch", icon: Split },
  { name: "Blog", href: "/admin/blogfeature", icon: NotebookPen },
  { name: "Event", href: "/admin/events", icon: Balloon },
  { name: "Gallery", href: "/admin/gallery", icon: Images },
  { name: "YT Videos", href: "/admin/ytvideos", icon: Hd },
  { name: "Documents", href: "/admin/documents", icon: FilePlusCorner },
  {
    name: "Expro Team Members",
    href: "/admin/exproTeamMembers",
    icon: UsersRound,
  },
  {
    name: "Recent Activity",
    href: "/admin/activitylogger",
    icon: Activity,
  },
  {
    name: "Contact Messages",
    href: "/admin/contactmessage",
    icon: MessageSquareShare,
  },
];

const userSidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pension Packages", href: "/admin/pension-packages", icon: Package },
  { name: "All Pension Members", href: "/admin/members", icon: Users },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Board Members", href: "/admin/board-members", icon: UserCheck },
  { name: "Wallet Balance", href: "/admin/wallet", icon: Wallet },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function MobileSidebar({ open, setOpen, isAdmin = true }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const items = isAdmin ? sidebarItems : userSidebarItems;

  // Lock body scroll while sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-40 lg:hidden
          bg-black/50 backdrop-blur-[2px]
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── Drawer ── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          fixed top-0 left-0 z-50 h-full w-[17rem]
          flex flex-col
          bg-white
         
          transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="relative w-32 h-9">
            <Image
              src="/logo.svg"
              alt="Expro Welfare Foundation"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="
              w-8 h-8 rounded-full flex items-center justify-center
              text-gray-400 hover:text-gray-600
              hover:bg-gray-100
              transition-colors duration-150
            "
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" &&
                item.href !== "/" &&
                pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  group relative flex items-center gap-3
                  px-3 py-2.5 rounded-xl
                  text-sm font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-[#1a7a3c] text-white shadow-sm shadow-green-900/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                {/* Active left accent bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white/40" />
                )}

                <item.icon
                  className={`w-[18px] h-[18px] shrink-0 transition-colors duration-150 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Footer actions ── */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-0.5">
          <Link
            href={isAdmin ? "/admin/settings" : "/dashboard/settings"}
            onClick={() => setOpen(false)}
            className="
              group flex items-center gap-3
              px-3 py-2.5 rounded-xl
              text-sm font-medium text-gray-600
              hover:bg-gray-50 hover:text-gray-900
              transition-colors duration-150
            "
          >
            <Settings className="w-[18px] h-[18px] text-gray-400 group-hover:text-gray-600 transition-colors duration-150" />
            Settings
          </Link>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
