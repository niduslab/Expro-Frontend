import {
  LayoutDashboard,
  Package,
  FolderKanban,
  Wallet,
  Banknote,
  Split,
  NotebookPen,
  Balloon,
  UsersRound,
  FilePlusCorner,
  Percent,
  Activity,
  SquareChartGantt,
  AudioLines,
  MessageSquareShare,
  ShieldCheck,
  Images,
  Hd,
  TrendingUp,
  Award,
  Bell,
  BarChart3,
  ArrowLeftRight,
  UserCog,
} from "lucide-react";
import type { ElementType } from "react";

export interface SidebarItem {
  name: string;
  href: string;
  icon: ElementType;
  permission?: string;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "access_dashboard" },
  { name: "Pension Packages", href: "/admin/pension-packages", icon: Package, permission: "access_pension_packages" },
  { name: "Pension Investments", href: "/admin/pension-investments", icon: TrendingUp, permission: "access_pension_investments" },
  { name: "Manage Members", href: "/admin/members", icon: SquareChartGantt, permission: "access_members" },
  { name: "Membership Request", href: "/admin/membership-request", icon: AudioLines, permission: "access_membership_requests" },
  { name: "Add Membership", href: "/admin/membership", icon: UsersRound, permission: "access_membership" },
  { name: "Role Applications", href: "/admin/pension-role-applications", icon: Award, permission: "access_role_applications" },
  { name: "User Management", href: "/admin/users", icon: UserCog, permission: "access_user_management" },
  { name: "Role Permission", href: "/admin/role-permission", icon: ShieldCheck, permission: "access_role_permission" },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban, permission: "access_projects" },
  { name: "Wallet Balance", href: "/admin/wallet", icon: Wallet, permission: "access_wallet" },
  { name: "Account Transfers", href: "/admin/account-transfers", icon: ArrowLeftRight, permission: "access_account_transfers" },
  { name: "Commission", href: "/admin/commission", icon: Percent, permission: "access_commission" },
  { name: "Donation", href: "/admin/donation", icon: Banknote, permission: "access_donation" },
  { name: "Branch", href: "/admin/branch", icon: Split, permission: "access_branch" },
  { name: "Blog", href: "/admin/blogfeature", icon: NotebookPen, permission: "access_blog" },
  { name: "Event", href: "/admin/events", icon: Balloon, permission: "access_events" },
  { name: "Gallery", href: "/admin/gallery", icon: Images, permission: "access_gallery" },
  { name: "YouTube Videos", href: "/admin/ytvideos", icon: Hd, permission: "access_youtube_videos" },
  { name: "Documents", href: "/admin/documents", icon: FilePlusCorner, permission: "access_documents" },
  { name: "Expro Team", href: "/admin/exproTeamMembers", icon: UsersRound, permission: "access_team_members" },
  { name: "Recent Activity", href: "/admin/activitylogger", icon: Activity, permission: "access_activity_log" },
  { name: "Contact Messages", href: "/admin/contactmessage", icon: MessageSquareShare, permission: "access_contact_messages" },
  { name: "Notifications", href: "/admin/notifications", icon: Bell, permission: "access_notifications" },
  { name: "Notification Analytics", href: "/admin/notification-logs", icon: BarChart3, permission: "access_notification_logs" },
];

export const sidebarGroups: SidebarGroup[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "access_dashboard" },
    ],
  },
  {
    label: "Pension",
    items: [
      { name: "Pension Packages", href: "/admin/pension-packages", icon: Package, permission: "access_pension_packages" },
      { name: "Pension Investments", href: "/admin/pension-investments", icon: TrendingUp, permission: "access_pension_investments" },
      { name: "Projects", href: "/admin/projects", icon: FolderKanban, permission: "access_projects" },
    ],
  },
  {
    label: "Members",
    items: [
      { name: "Manage Members", href: "/admin/members", icon: SquareChartGantt, permission: "access_members" },
      { name: "Membership Request", href: "/admin/membership-request", icon: AudioLines, permission: "access_membership_requests" },
      { name: "Add Membership", href: "/admin/membership", icon: UsersRound, permission: "access_membership" },
      { name: "Role Applications", href: "/admin/pension-role-applications", icon: Award, permission: "access_role_applications" },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Wallet Balance", href: "/admin/wallet", icon: Wallet, permission: "access_wallet" },
      { name: "Account Transfers", href: "/admin/account-transfers", icon: ArrowLeftRight, permission: "access_account_transfers" },
      { name: "Commission", href: "/admin/commission", icon: Percent, permission: "access_commission" },
      { name: "Donation", href: "/admin/donation", icon: Banknote, permission: "access_donation" },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Blog", href: "/admin/blogfeature", icon: NotebookPen, permission: "access_blog" },
      { name: "Events", href: "/admin/events", icon: Balloon, permission: "access_events" },
      { name: "Gallery", href: "/admin/gallery", icon: Images, permission: "access_gallery" },
      { name: "YouTube Videos", href: "/admin/ytvideos", icon: Hd, permission: "access_youtube_videos" },
      { name: "Documents", href: "/admin/documents", icon: FilePlusCorner, permission: "access_documents" },
      { name: "Expro Team", href: "/admin/exproTeamMembers", icon: UsersRound, permission: "access_team_members" },
    ],
  },
  {
    label: "System",
    items: [
      { name: "User Management", href: "/admin/users", icon: UserCog, permission: "access_user_management" },
      { name: "Role Permission", href: "/admin/role-permission", icon: ShieldCheck, permission: "access_role_permission" },
      { name: "Branch", href: "/admin/branch", icon: Split, permission: "access_branch" },
      { name: "Contact Messages", href: "/admin/contactmessage", icon: MessageSquareShare, permission: "access_contact_messages" },
      { name: "Recent Activity", href: "/admin/activitylogger", icon: Activity, permission: "access_activity_log" },
      { name: "Notifications", href: "/admin/notifications", icon: Bell, permission: "access_notifications" },
      { name: "Notification Analytics", href: "/admin/notification-logs", icon: BarChart3, permission: "access_notification_logs" },
    ],
  },
];
