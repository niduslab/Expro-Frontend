"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  FolderKanban,
  UserCheck,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/router";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pension Packages", href: "/admin/pension-packages", icon: Package },
  { name: "All Pension Members", href: "/admin/members", icon: Users },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Board Members", href: "/admin/board-members", icon: UserCheck },
  { name: "Wallet Balance", href: "/admin/wallet", icon: Wallet },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <Link href="/admin" className="flex items-center">
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
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          Settings
        </Link>
        <button
          onClick={() => {
            // Add logout logic here
            document.cookie =
              "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
            router.push("/login");
          }}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          Logout
        </button>
      </div>
    </div>
  );
}
