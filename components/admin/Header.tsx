"use client";

import Image from "next/image";
import { Search, Menu, LayoutDashboard, Users } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";
import { canAccessAdmin as canEnterAdminPanel } from "@/lib/utils/permissions";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data } = useMyProfile();
  const profile = data;
  const router = useRouter();
  const pathname = usePathname();

  // Can the user reach the admin panel via their roles/permissions?
  // This mirrors the gate used by the admin layout: full access, the
  // `admin_access` gate, any granted `access_*` page permission, or a legacy
  // admin/chairman role.
  const hasAdminPanelAccess = canEnterAdminPanel(profile ?? null);

  // Check for pension package roles (executive_member, project_presenter, assistant_pp)
  const pensionEnrollments = profile?.pension_enrollments || [];
  const hasAdvancedPensionRole = pensionEnrollments.some((enrollment: any) => {
    const pensionRoles = enrollment.pension_package_roles || [];
    return pensionRoles.some((role: any) =>
      role.is_active &&
      ['executive_member', 'project_presenter', 'assistant_pp'].includes(role.role)
    );
  });

  // User can access admin if they have admin panel access OR advanced pension role
  const canAccessAdmin = hasAdminPanelAccess || hasAdvancedPensionRole;
  
  const isAdminRoute = pathname?.startsWith("/admin");

  const handleProfileClick = () => {
    // Navigate based on current route context
    if (isAdminRoute) {
      router.push("/admin/profile");
    } else {
      router.push("/dashboard/profile");
    }
  };

  const handleDashboardSwitch = () => {
    // If currently in admin route, go to member dashboard
    if (isAdminRoute) {
      router.push("/dashboard");
    } else {
      // If currently in member dashboard and can access admin, go to admin dashboard
      if (canAccessAdmin) {
        router.push("/admin");
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Left section */}
      <div className="flex items-center gap-4 w-full max-w-md">
        {/* Hamburger (mobile + tablet) */}
        <button onClick={onMenuClick} className="lg:hidden p-1">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications */}
        <NotificationBell userId={profile?.id} />

        {/* Dashboard Switch Button */}
        {isAdminRoute ? (
          // Show "Go to Member Dashboard" when in admin route
          <button
            onClick={handleDashboardSwitch}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title="Go to Member Dashboard"
          >
            <Users className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">
              Member Dashboard
            </span>
          </button>
        ) : canAccessAdmin ? (
          // Show "Go to Admin Dashboard" when in member dashboard and can access admin
          <button
            onClick={handleDashboardSwitch}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            title="Go to Admin Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">
              Admin Dashboard
            </span>
          </button>
        ) : null}

        {/* Profile */}
        <div
          onClick={handleProfileClick}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border">
            <Image
              src={
                profile?.member?.photo
                  ? profile.member.photo.startsWith('http')
                    ? profile.member.photo
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${profile.member.photo}`
                  : "/images/default-avatar.svg"
              }
              alt="avatar"
              fill
              className="object-cover"
              unoptimized={profile?.member?.photo ? true : false}
            />
          </div>

          <div className="hidden md:block text-sm">
            <p className="font-semibold text-gray-900">
              {profile?.member?.name_english}
            </p>
            <p className="text-xs text-gray-500 capitalize">{profile?.roles[0]}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
