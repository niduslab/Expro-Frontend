"use client";

import { AdminSidebar } from "./admin-sidebar";
import { MobileSidebar } from "./mobile-sidebar";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin?: boolean;
}

export function AdminSidebarWrapper({ open, setOpen, isAdmin = true }: Props) {
  return (
    <>
      <AdminSidebar isAdmin={isAdmin} />
      <MobileSidebar open={open} setOpen={setOpen} isAdmin={isAdmin} />
    </>
  );
}
