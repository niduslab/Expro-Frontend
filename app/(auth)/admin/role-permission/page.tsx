"use client";

import { useState } from "react";
import {
  useRoles,
  useUsers,
  usePermissions,
  useDeleteRole,
} from "@/lib/hooks/admin/useUsers";
import {
  Loader2,
  ShieldCheck,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  KeyRound,
  Pencil,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import AssignRoleModal from "./AssignRoleModal";
import RoleFormModal from "./RoleFormModal";
import PermissionsModal from "./PermissionsModal";
import { UserListItem } from "@/lib/types/admin/userType";
import { Role } from "@/lib/types/admin/roleType";

export default function RolePermissionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Role create/edit + permissions modals
  const [roleFormOpen, setRoleFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { data: permissions } = usePermissions();
  const { data: usersData, isLoading: usersLoading } = useUsers({
    page: currentPage,
  });
  const deleteRoleMutation = useDeleteRole();

  const handleAssignRole = (user: UserListItem) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openCreateRole = () => {
    setEditingRole(null);
    setRoleFormOpen(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleFormOpen(true);
  };

  const handleDeleteRole = async (role: Role) => {
    if (
      !confirm(
        `Delete the "${role.name}" role? Users will lose this role. This cannot be undone.`,
      )
    )
      return;
    try {
      await deleteRoleMutation.mutateAsync(role.id);
      toast.success("Role deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete role");
    }
  };

  // Filter users based on search query
  const filteredUsers =
    usersData?.data?.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      const fullName =
        `${user.member?.name_english || ""} ${user.member?.name_english || ""}`.toLowerCase();
      const email = user.email.toLowerCase();
      const memberId = user.member?.member_id?.toLowerCase() || "";

      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        memberId.includes(searchLower)
      );
    }) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (rolesLoading || usersLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#068847]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#030712]">
            Role &amp; Permission Management
          </h1>
          <p className="text-[#6B7280] mt-1">
            Create roles, define permissions, and assign roles to users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPermissionsOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-[#4A5565] hover:bg-[#F3F4F6] transition-colors font-medium"
          >
            <KeyRound className="h-4 w-4" />
            Manage Permissions
          </button>
          <button
            onClick={openCreateRole}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            Create Role
          </button>
        </div>
      </div>

      {/* Roles Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="h-5 w-5 text-[#068847]" />
          <h2 className="text-xl font-semibold text-[#030712]">
            Available Roles
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roles?.map((role) => (
            <div
              key={role.id}
              className="border-2 border-[#E5E7EB] rounded-xl p-4 hover:border-[#068847]/30 transition-colors flex flex-col"
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <h3 className="font-semibold text-base uppercase text-[#030712] truncate">
                  {role.name}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditRole(role)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#068847] transition-colors"
                    title="Edit role & permissions"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  {!role.is_protected && (
                    <button
                      onClick={() => handleDeleteRole(role)}
                      className="p-1.5 rounded-lg text-[#6B7280] hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete role"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {role.is_protected && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-medium uppercase">
                    Protected
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
                  <UsersIcon className="h-3 w-3" />
                  {role.users_count ?? 0} users
                </span>
              </div>
              {role.permissions && role.permissions.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1">
                  {role.permissions.slice(0, 8).map((permission, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-[#F3F4F6] text-[#4A5565] rounded"
                    >
                      {permission}
                    </span>
                  ))}
                  {role.permissions.length > 8 && (
                    <span className="text-xs px-2 py-1 text-[#6B7280]">
                      +{role.permissions.length - 8} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#9CA3AF] mt-1">No permissions</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#068847]" />
            <h2 className="text-xl font-semibold text-[#030712]">
              Assign Roles to Users
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by name, email, or member ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Member ID
                </th>
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Name
                </th>
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Email
                </th>
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Current Roles
                </th>
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Status
                </th>
                <th className="text-left p-3 font-semibold text-[#030712]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]"
                  >
                    <td className="p-3">
                      <span className="text-sm font-medium text-[#068847]">
                        {user.member?.member_id || "N/A"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-[#030712]">
                        {user.member?.name_english ||
                          `${user.member?.name_english || ""} ${user.member?.name_english || ""}`.trim() ||
                          "N/A"}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-[#6B7280]">{user.email}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.length > 0 ? (
                          user.roles.map((role, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-[#068847] text-white rounded uppercase"
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[#6B7280]">
                            No roles assigned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-[#CCFBF1] text-[#0D9488]"
                            : "bg-[#F3F4F6] text-gray-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleAssignRole(user)}
                        className="px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg text-[#4A5565] hover:bg-[#F3F4F6] transition-colors"
                      >
                        Assign Role
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#6B7280]">
                    {searchQuery
                      ? "No users found matching your search."
                      : "No users available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersData?.pagination && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E5E7EB]">
            <div className="text-sm text-[#6B7280]">
              Showing{" "}
              {(usersData.pagination.current_page - 1) *
                usersData.pagination.per_page +
                1}{" "}
              to{" "}
              {Math.min(
                usersData.pagination.current_page *
                  usersData.pagination.per_page,
                usersData.pagination.total,
              )}{" "}
              of {usersData.pagination.total} users
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: usersData.pagination.last_page },
                  (_, i) => i + 1,
                )
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === usersData.pagination.last_page ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-[#6B7280]">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-[#068847] text-white"
                            : "border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#4A5565]"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === usersData.pagination.last_page}
                className="p-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assign Role Modal */}
      <AssignRoleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        availableRoles={roles || []}
      />

      {/* Create / Edit Role Modal */}
      <RoleFormModal
        isOpen={roleFormOpen}
        onClose={() => {
          setRoleFormOpen(false);
          setEditingRole(null);
        }}
        role={editingRole}
        permissions={permissions || []}
      />

      {/* Manage Permissions Modal */}
      <PermissionsModal
        isOpen={permissionsOpen}
        onClose={() => setPermissionsOpen(false)}
      />
    </div>
  );
}
