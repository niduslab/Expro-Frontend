"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";
import { canAccessAdmin } from "@/lib/utils/permissions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useMyProfile();

  // Once we know who the user is, send anyone without the admin_access gate
  // back to the member dashboard. This protects direct /admin/* navigation.
  const allowed = !isLoading && !isError && canAccessAdmin(profile ?? null);

  useEffect(() => {
    if (isLoading) return;
    if (isError || !canAccessAdmin(profile ?? null)) {
      router.replace("/dashboard");
    }
  }, [isLoading, isError, profile, router]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#068847]" />
      </div>
    );
  }

  if (!allowed) {
    // Redirect is in-flight; render nothing to avoid flashing admin content.
    return null;
  }

  return <>{children}</>;
}
