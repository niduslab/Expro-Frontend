"use client";

import { useState } from "react";
import { useRoles, useSystemUsers } from "@/lib/hooks/admin/useUsers";
import {
  Loader2,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
  Mail,
  Phone,
  Pencil,
  KeyRound,
} from "lucide-react";
import CreateSystemUserModal from "./CreateSystemUserModal";
import EditSystemUserModal from "./EditSystemUserModal";
import ChangePasswordModal from "./ChangePasswordModal";
import ManageUserRolesModal from "./ManageUserRolesModal";
import { SystemUser } from "@/lib/types/admin/userType";

export default function UserManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Per-user action modals
  const [editUser, setEditUser] = useState<SystemUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<SystemUser | null>(null);
  const [rolesUser, setRolesUser] = useState<SystemUser | null>(null);

  const { data: roles } = useRoles();
  const { data: usersData, isLoading, isFetching } = useSystemUsers({
    page: currentPage,
    search: searchQuery || undefined,
  });

  const users = usersData?.data ?? [];
  const pagination = usersData?.pagination;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#030712]">User Management</h1>
          <p className="text-[#6B7280] mt-1">
            Create and manage admin &amp; staff accounts
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors font-medium"
        >
          <UserPlus className="h-4 w-4" />
          Add System User
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#068847]/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-[#068847]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#030712]">
              {pagination?.total ?? users.length}
            </p>
            <p className="text-sm text-[#6B7280]">System Users</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#068847]/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-[#068847]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#030712]">
              {roles?.length ?? 0}
            </p>
            <p className="text-sm text-[#6B7280]">Available Roles</p>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#068847]/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-[#068847]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#030712]">
              {users.filter((u) => u.status === "active").length}
            </p>
            <p className="text-sm text-[#6B7280]">Active (this page)</p>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#068847]" />
            <h2 className="text-xl font-semibold text-[#030712]">
              System Users
            </h2>
            {isFetching && (
              <Loader2 className="h-4 w-4 animate-spin text-[#068847]" />
            )}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by name, email, phone or ID..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left p-3 font-semibold text-[#030712]">
                  User
                </th>
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Contact
                </th>
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Roles
                </th>
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Permissions
                </th>
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Status
                </th>
                <th className="text-right p-3 font-semibold text-[#030712]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#068847] mx-auto" />
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] align-top"
                  >
                    <td className="p-3">
                      <div className="font-medium text-[#030712]">
                        {user.name || "—"}
                      </div>
                      {user.member_id && (
                        <div className="text-xs text-[#068847] font-medium mt-0.5">
                          {user.member_id}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-sm text-[#4A5565]">
                        <Mail className="h-3.5 w-3.5 text-[#9CA3AF]" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-sm text-[#6B7280] mt-0.5">
                          <Phone className="h-3.5 w-3.5 text-[#9CA3AF]" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <span
                              key={role}
                              className="text-xs px-2 py-1 bg-[#068847] text-white rounded uppercase"
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[#6B7280]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 bg-[#F3F4F6] text-[#4A5565] rounded">
                        {user.permissions.length} permission
                        {user.permissions.length === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full capitalize ${
                          user.status === "active"
                            ? "bg-[#CCFBF1] text-[#0D9488]"
                            : "bg-[#F3F4F6] text-gray-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setRolesUser(user)}
                          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#068847] transition-colors"
                          title="Manage roles"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setPasswordUser(user)}
                          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#068847] transition-colors"
                          title="Change password"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditUser(user)}
                          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#068847] transition-colors"
                          title="Edit user"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#6B7280]">
                    {searchQuery
                      ? "No system users match your search."
                      : "No system users yet. Click “Add System User” to create one."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E5E7EB] gap-4 flex-wrap">
            <div className="text-sm text-[#6B7280]">
              Page {pagination.current_page} of {pagination.last_page} ·{" "}
              {pagination.total} users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pagination.current_page === 1}
                className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(pagination.last_page, p + 1),
                  )
                }
                disabled={pagination.current_page === pagination.last_page}
                className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateSystemUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableRoles={roles || []}
      />

      <EditSystemUserModal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
      />

      <ChangePasswordModal
        isOpen={!!passwordUser}
        onClose={() => setPasswordUser(null)}
        user={passwordUser}
      />

      <ManageUserRolesModal
        isOpen={!!rolesUser}
        onClose={() => setRolesUser(null)}
        user={rolesUser}
        availableRoles={roles || []}
      />
    </div>
  );
}
