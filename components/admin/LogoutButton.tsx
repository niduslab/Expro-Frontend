"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useLogout } from "@/lib/hooks";

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

/**
 * Logout Button Component
 * Handles user logout with proper API integration
 */
export function LogoutButton({ 
  className = "", 
  showIcon = true, 
  showText = true 
}: LogoutButtonProps) {
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {showIcon && <LogOut className="w-5 h-5 text-gray-500" />}
      {showText && (isPending ? "Logging out..." : "Logout")}
    </button>
  );
}
