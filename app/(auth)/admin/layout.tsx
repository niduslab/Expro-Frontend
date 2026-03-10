"use client";

import { useState } from "react";
import { AdminSidebarWrapper } from "@/components/admin/AdminSidebarWrapper";
import { AdminHeader } from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWrapper open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col lg:pl-64 2xl:flex 2xl:items-center 2xl:justify-center">
        <AdminHeader onMenuClick={() => setOpen(true)} />

        <main className="flex-1 p-4 md:p-6 overflow-hidden md:overflow-auto container ">
          {children}
        </main>
      </div>
    </div>
  );
}
