"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebarWrapper } from "@/components/admin/AdminSidebarWrapper";
import { AdminHeader } from "@/components/admin/Header";
import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Check if we're in admin routes
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWrapper open={open} setOpen={setOpen} isAdmin={isAdminRoute} />

      <div className="flex-1 flex flex-col font-dm-sans min-w-0 lg:pl-64 2xl:flex 2xl:items-center 2xl:justify-center">
        <AdminHeader onMenuClick={() => setOpen(true)} />

        <main className="flex-1 p-4 md:p-6 w-full min-w-0">
          {children}
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              duration: 2500,
              classNames: {
                toast:
                  "relative overflow-hidden rounded-lg px-4 py-3 font-medium",
              },
            }}
          />
        </main>
      </div>
    </div>
  );
}
