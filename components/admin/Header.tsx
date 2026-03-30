"use client";

import React from "react";
import Image from "next/image";
import { Search, Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMyProfile } from "@/lib/hooks/admin/useMemberProfile";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data } = useMyProfile();

  const profile = data;

  const router = useRouter();

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
        <button
          onClick={() => router.push("/admin/notifications")}
          className="relative p-2 hover:bg-gray-100 rounded-full"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Profile */}
        <div
          onClick={() => router.push("/admin/profile")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border">
            <Image
              src={profile?.member?.photo || "/images/default-avatar.png"}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>

          <div className="hidden md:block text-sm">
            <p className="font-semibold text-gray-900">
              {profile?.member?.name_english}
            </p>
            <p className="text-xs text-gray-500">{profile?.roles[0]}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
