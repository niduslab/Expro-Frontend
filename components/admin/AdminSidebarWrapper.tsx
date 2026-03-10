"use client";

import { AdminSidebar } from "./admin-sidebar";
import { MobileSidebar } from "./mobile-sidebar";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AdminSidebarWrapper({ open, setOpen }: Props) {
  return (
    <>
      <AdminSidebar />
      <MobileSidebar open={open} setOpen={setOpen} />
    </>
  );
}
