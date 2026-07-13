"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { sidebarGroups, sidebarItems } from "./sidebar-items";
import { DynamicUserSidebar } from "./DynamicUserSidebar";
import { LogoutButton } from "./LogoutButton";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";
import { filterSidebarByPermissions } from "@/lib/utils/permissions";

interface AdminSidebarProps {
  isAdmin?: boolean;
}

export function AdminSidebar({ isAdmin = true }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: profile, isLoading: profileLoading } = useMyProfile();

  const allVisibleHrefs = profileLoading
    ? new Set<string>()
    : new Set(filterSidebarByPermissions(sidebarItems, profile ?? null).map((i) => i.href));

  if (!isAdmin) {
    return <DynamicUserSidebar />;
  }

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b border-gray-100 shrink-0">
        <Link href="/admin" className="flex items-center">
          <div className="relative w-32 h-9">
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
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {profileLoading ? (
          <div className="space-y-5">
            {[6, 4, 4, 4, 6, 6].map((count, gi) => (
              <div key={gi}>
                <div className="h-3 w-16 rounded bg-gray-100 animate-pulse mx-2 mb-2" />
                <div className="space-y-0.5">
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                      <div className="w-[18px] h-[18px] rounded bg-gray-100 animate-pulse shrink-0" />
                      <div className="h-3 flex-1 rounded bg-gray-100 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {sidebarGroups.map((group) => {
              const visibleItems = group.items.filter((item) => allVisibleHrefs.has(item.href));
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.label}>
                  <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 select-none">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {visibleItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                            isActive
                              ? "bg-[#068847] text-white shadow-sm shadow-green-800/20"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-white/50" />
                          )}
                          <item.icon
                            className={`w-[18px] h-[18px] shrink-0 transition-colors duration-150 ${
                              isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="shrink-0 border-t border-gray-100 px-3 py-3 space-y-0.5">
        <Link
          href="/admin/settings"
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            pathname === "/admin/settings"
              ? "bg-[#068847] text-white shadow-sm shadow-green-800/20"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings
            className={`w-[18px] h-[18px] shrink-0 transition-colors duration-150 ${
              pathname === "/admin/settings" ? "text-white" : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
          Settings
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
