import {
  LayoutDashboard,
  Package,
  Users,
  FolderKanban,
  UserCheck,
  Wallet,
  BanknoteArrowDown,
  Split,
} from "lucide-react";

export const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pension Packages", href: "/admin/pension-packages", icon: Package },
  { name: "All Pension Members", href: "/admin/members", icon: Users },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Board Members", href: "/admin/board-members", icon: UserCheck },
  { name: "Wallet Balance", href: "/admin/wallet", icon: Wallet },
  { name: "Donation", href: "/admin/donation", icon: BanknoteArrowDown },
  { name: "Branch", href: "/admin/branch", icon: Split },
];
