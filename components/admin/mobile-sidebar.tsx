"use client";

import React from "react";
import { LogOut, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarItems } from "./sidebar-items";
import { userSidebarItems } from "./user-sidebar-items";
import Image from "next/image";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin?: boolean;
}

export function MobileSidebar({ open, setOpen, isAdmin = true }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const items = isAdmin ? sidebarItems : userSidebarItems;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="relative w-28 h-8">
            <Image
              src="/logo.svg"
              alt="Expro Welfare Foundation"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-2 ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-0 w-full px-4 space-y-2">
          <Link
            href={isAdmin ? "/admin/settings" : "/dashboard/settings"}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {" "}
            <Settings className="w-5 h-5 text-gray-500" />
            Settings
          </Link>

          <button
            onClick={() => {
              document.cookie =
                "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
              router.push("/login");
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg text-left transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
