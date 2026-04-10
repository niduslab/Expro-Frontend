import {
  LayoutDashboard,
  User,
  CreditCard,
  Bell,
  FileText,
  Calendar,
  User2,
  Users,
  Wallet,
  LocationEdit,
  FolderKanban,
} from "lucide-react";

export const userSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Wallet", href: "/dashboard/wallets", icon: Wallet },
  { name: "Project", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Pensions", href: "/dashboard/pensions", icon: FileText },
  { name: "Nominee", href: "/dashboard/nominees", icon: Users },
  { name: "Branch", href: "/dashboard/branches", icon: LocationEdit },
];
