import {
  LayoutDashboard,
  Package,
  Users,
  FolderKanban,
  UserCheck,
  Wallet,
  Banknote,
  Split,
  NotebookPen,
  Balloon,
  UsersRound,
  FilePlusCorner,
  UserRoundCheck,
  Activity,
} from "lucide-react";

export const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pension Packages", href: "/admin/pension-packages", icon: Package },

  { name: "Manage Members", href: "/admin/members", icon: Package },
  { name: "Membership Request", href: "/admin/membership-request", icon: Package },
  // { name: "All Pension Members", href: "/admin/members", icon: Users },

  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Wallet Balance", href: "/admin/wallet", icon: Wallet },

  { name: "Donation", href: "/admin/donation", icon: Banknote },

  { name: "Branch", href: "/admin/branch", icon: Split },
  { name: "Blog", href: "/admin/blogfeature", icon: NotebookPen },
  { name: "Event", href: "/admin/events", icon: Balloon },
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
];
