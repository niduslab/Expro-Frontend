"use client";

import React from "react";
import Image from "next/image";
import { Search, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminHeader() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
      {/* Search Bar */}
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search here"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          onClick={() => {
            router.push("/admin/notifications");
          }}
          className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="sr-only">View notifications</span>
          <Bell className="h-6 w-6" />
          {/* Notification Badge */}
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <div
          onClick={() => {
            router.push("/admin/profile");
          }}
          className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            {/* Placeholder avatar */}
            <Image
              src="/images/landing-page/our-leadership/06-md-ataur-rahman.png"
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-semibold text-gray-900">Md motahar</p>
            <p className="text-xs text-gray-500">Founder & Chairman</p>
          </div>
        </div>
      </div>
    </header>
  );
}
