"use client";

import React, { useEffect } from "react";
import { Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LogoutButton } from "./LogoutButton";
import { userSidebarItems as memberSidebarItems } from "./user-sidebar-items";
import { sidebarGroups, sidebarItems } from "./sidebar-items";
import { useAvailableRoles } from "@/lib/hooks/user/usePensionRoleApplications";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";
import { filterSidebarByPermissions } from "@/lib/utils/permissions";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin?: boolean;
}

const ELIGIBLE_ROLES = ["executive_member", "project_presenter", "assistant_pp"];

export function MobileSidebar({ open, setOpen, isAdmin = true }: Props) {
  const pathname = usePathname();
  const { data: availableRolesData } = useAvailableRoles();
  const { data: profile, isLoading: profileLoading } = useMyProfile();

  const currentRole = availableRolesData?.data?.current_role;
  const hasAdvancedRole = currentRole && ELIGIBLE_ROLES.includes(currentRole.value);

  const filteredMemberItems = memberSidebarItems.filter((item) => {
    if (item.href === "/dashboard/role-application") return !hasAdvancedRole;
    if (item.href === "/dashboard/membership") return !!hasAdvancedRole;
    return true;
  });

  const allVisibleHrefs = profileLoading
    ? new Set<string>()
    : new Set(filterSidebarByPermissions(sidebarItems, profile ?? null).map((i) => i.href));

  const showAdminSkeleton = isAdmin && profileLoading;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 left-0 z-50 h-full w-[17rem] flex flex-col bg-white transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
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
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-200">
          {showAdminSkeleton ? (
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
          ) : isAdmin ? (
            /* Admin grouped nav */
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
                            onClick={() => setOpen(false)}
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
          ) : (
            /* Member flat nav */
            <div className="space-y-0.5">
              {filteredMemberItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
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
          )}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 px-3 py-3 space-y-0.5">
          <Link
            href={isAdmin ? "/admin/settings" : "/dashboard/settings"}
            onClick={() => setOpen(false)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              pathname.endsWith("/settings")
                ? "bg-[#068847] text-white shadow-sm shadow-green-800/20"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings
              className={`w-[18px] h-[18px] shrink-0 transition-colors duration-150 ${
                pathname.endsWith("/settings") ? "text-white" : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
            Settings
          </Link>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
