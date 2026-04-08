"use client";

import { useAuthStatus } from "@/lib/hooks/public/useAuth";

export default function DashboardPage() {
  const { user, isLoading } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name || "User"}
        </h1>
        <p className="text-gray-600 mt-1">
          This is your personal dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            My Profile
          </h3>
          <p className="text-gray-600 text-sm">
            View and manage your profile information
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            My Membership
          </h3>
          <p className="text-gray-600 text-sm">
            Check your membership status and details
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Notifications
          </h3>
          <p className="text-gray-600 text-sm">
            View your recent notifications
          </p>
        </div>
      </div>
    </div>
  );
}
