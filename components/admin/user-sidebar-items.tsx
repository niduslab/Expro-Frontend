import {
  LayoutDashboard,
  User,
  CreditCard,
  Bell,
  FileText,
  Calendar,
} from "lucide-react";

export const userSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
  { name: "My Membership", href: "/dashboard/membership", icon: CreditCard },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
];
