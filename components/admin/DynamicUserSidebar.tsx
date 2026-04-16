"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { userSidebarItems } from "./user-sidebar-items";
import { LogoutButton } from "./LogoutButton";
import { useMemberDashboard } from "@/lib/hooks/admin/useUsers";

export function DynamicUserSidebar() {
  const pathname = usePathname();
  const { data: dashboardData } = useMemberDashboard();

  // Get current pension role from dashboard data
  const pensionEnrollments = dashboardData?.data?.pension_enrollments || [];
  
  // Check if user has any advanced role (executive_member, project_presenter, assistant_pp)
  const hasAdvancedRole = pensionEnrollments.some((enrollment: any) => {
    const roles = enrollment.pension_package_roles || [];
    return roles.some((role: any) => 
      role.is_active && 
      ['executive_member', 'project_presenter', 'assistant_pp'].includes(role.role)
    );
  });

  // Filter out "Apply for Role" if user already has an advanced role
  const filteredItems = userSidebarItems.filter(item => {
    if (item.href === "/dashboard/role-application") {
      return !hasAdvancedRole;
    }
    return true;
  });

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-sm flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center">
          <div className="relative w-32 h-10">
            <Image
              src="/logo.svg"
              alt="Expro Welfare Foundation"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-[#068847] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-900"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          Settings
        </Link>

        <LogoutButton />
      </div>
    </aside>
  );
}
