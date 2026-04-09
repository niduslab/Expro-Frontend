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
} from "lucide-react";

export const userSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Nominee", href: "/dashboard/nominees", icon: Users },
  { name: "Wallet", href: "/dashboard/wallets", icon: Wallet },
  { name: "Pensions", href: "/dashboard/pensions", icon: FileText },
  { name: "Branch", href: "/dashboard/branches", icon: LocationEdit },
];
