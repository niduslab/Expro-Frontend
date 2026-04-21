"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ServerCrash,
  Wallet,
} from "lucide-react";

import {
  usePaymentGatewayConfigs,
  useCreatePaymentGatewayConfig,
  useDeletePaymentGatewayConfig,
  useUpdatePaymentGatewayConfig,
} from "@/lib/hooks/admin/usePaymentGatewayConfigHook";

import type {
  PaymentGatewayConfig,
  PaymentGatewayConfigQueryParams,
  CreatePaymentGatewayConfigPayload,
  UpdatePaymentGatewayConfigPayload,
} from "@/lib/types/admin/Paymentgatewayconfig";
import { CustomSelect } from "../../projects/projectMember/[id]/Projectmemberui";
import Pagination from "@/components/pagination/page";
import PaymentGatewayConfigModal from "./Paymentgatewayconfigmodal";
import PaymentGatewayConfigDetailDrawer from "./Paymentgatewayconfigdetaildrawer";
import { DeleteConfirm } from "./Deleteconfirm";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const GATEWAY_FILTER_OPTIONS = [
  { label: "All Gateways", value: "" },
  { label: "bKash", value: "bkash" },
  { label: "Nagad", value: "nagad" },
  { label: "Rocket", value: "rocket" },
  { label: "Stripe", value: "stripe" },
  { label: "PayPal", value: "paypal" },
];

const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const PER_PAGE_OPTIONS = [
  { label: "10 / page", value: "10" },
  { label: "25 / page", value: "25" },
  { label: "50 / page", value: "50" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GATEWAY_BADGE: Record<string, { bg: string; text: string; emoji: string }> = {
  bkash:  { bg: "bg-pink-50",   text: "text-pink-700",   emoji: "💰" },
  nagad:  { bg: "bg-orange-50", text: "text-orange-700", emoji: "🔶" },
  rocket: { bg: "bg-purple-50", text: "text-purple-700", emoji: "🚀" },
  stripe: { bg: "bg-blue-50",   text: "text-blue-700",   emoji: "💳" },
  paypal: { bg: "bg-sky-50",    text: "text-sky-700",    emoji: "🌐" },
};

const getGatewayStyle = (type: string) =>
  GATEWAY_BADGE[type] ?? { bg: "bg-gray-100", text: "text-gray-600", emoji: "⚙️" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentGatewayConfigPage() {
  // ── Filter + Pagination State ──
  const [params, setParams] = useState<PaymentGatewayConfigQueryParams>({
    page: 1,
    per_page: 10,
  });
  const [filterGateway, setFilterGateway] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ── Modal/Drawer State ──
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedConfig, setSelectedConfig] = useState<PaymentGatewayConfig | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Build Query Params ──
  const queryParams: PaymentGatewayConfigQueryParams = {
    ...params,
    ...(filterGateway && { gateway_type: filterGateway }),
    ...(filterStatus !== "" && { is_active: filterStatus === "true" }),
  };

  // ── Data Hooks ──
  const { data, isLoading, isError, refetch, isFetching } =
    usePaymentGatewayConfigs(queryParams);

  const createMutation = useCreatePaymentGatewayConfig();
  const deleteMutation = useDeletePaymentGatewayConfig();
  const updateMutation = useUpdatePaymentGatewayConfig(selectedConfig?.id ?? 0);

  const configs = data?.data ?? [];
  const pagination = data?.pagination;

  // ── Handlers ──
  const handleCreate = (payload: CreatePaymentGatewayConfigPayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Gateway configuration created!");
        setModalOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? "Failed to create configuration");
      },
    });
  };

  const handleUpdate = (payload: UpdatePaymentGatewayConfigPayload) => {
    updateMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Gateway configuration updated!");
        setModalOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? "Failed to update configuration");
      },
    });
  };

  const handleDelete = () => {
    if (!selectedConfig) return;
    deleteMutation.mutate(selectedConfig.id, {
      onSuccess: () => {
        toast.success("Configuration deleted successfully");
        setDeleteModalOpen(false);
        setSelectedConfig(null);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? "Failed to delete configuration");
      },
    });
  };

  const openCreate = () => {
    setSelectedConfig(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (config: PaymentGatewayConfig) => {
    setSelectedConfig(config);
    setModalMode("edit");
    setModalOpen(true);
    setDrawerOpen(false);
  };

  const openDelete = (config: PaymentGatewayConfig) => {
    setSelectedConfig(config);
    setDeleteModalOpen(true);
  };

  const openDetail = (config: PaymentGatewayConfig) => {
    setSelectedConfig(config);
    setDrawerOpen(true);
  };

  const applyFilters = () => {
    setParams((p) => ({ ...p, page: 1 }));
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilterGateway("");
    setFilterStatus("");
    setSearch("");
    setParams({ page: 1, per_page: params.per_page });
    setShowFilters(false);
  };

  const activeFiltersCount = [filterGateway, filterStatus].filter(Boolean).length;

  // ── Client-side search filter ──
  const displayConfigs = search
    ? configs.filter((c) =>
        c.gateway_type.toLowerCase().includes(search.toLowerCase())
      )
    : configs;

  // ── Render ──
  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Payment Gateways
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your payment gateway configurations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-green-600 hover:border-green-300 transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Gateway
            </button>
          </div>
        </div>

        {/* ── Search + Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by gateway type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 border border-[#D1D5DC] rounded-[10px] text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 h-[44px] border rounded-[10px] text-sm font-medium transition whitespace-nowrap ${
                showFilters || activeFiltersCount > 0
                  ? "border-green-500 text-green-700 bg-green-50"
                  : "border-[#D1D5DC] text-gray-600 bg-white hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Per page */}
            <div className="w-full sm:w-[140px]">
              <CustomSelect
                value={String(params.per_page)}
                onChange={(v) => setParams((p) => ({ ...p, per_page: Number(v), page: 1 }))}
                options={PER_PAGE_OPTIONS}
              />
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Gateway Type</label>
                <CustomSelect
                  value={filterGateway}
                  onChange={setFilterGateway}
                  options={GATEWAY_FILTER_OPTIONS}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Status</label>
                <CustomSelect
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={STATUS_FILTER_OPTIONS}
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 h-[44px] bg-green-600 text-white text-sm font-semibold rounded-[10px] hover:bg-green-700 transition"
                >
                  Apply
                </button>
                <button
                  onClick={resetFilters}
                  className="flex-1 h-[44px] bg-gray-100 text-gray-600 text-sm font-medium rounded-[10px] hover:bg-gray-200 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin text-green-500" />
              <p className="text-sm">Loading configurations...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
              <ServerCrash className="w-10 h-10 text-red-400" />
              <p className="text-sm font-medium text-gray-600">Failed to load data</p>
              <button
                onClick={() => refetch()}
                className="text-sm text-green-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : displayConfigs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400">
              <span className="text-5xl"><Wallet/></span>
              <p className="text-sm font-medium text-gray-500 mt-2">No configurations found</p>
              <p className="text-xs text-gray-400">Add a new gateway to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      #
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Gateway
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Credentials
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Updated
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayConfigs.map((config, idx) => {
                    const style = getGatewayStyle(config.gateway_type);
                    const credCount = Object.keys(config.credentials ?? {}).length;
                    return (
                      <tr
                        key={config.id}
                        className="hover:bg-gray-50/60 transition group"
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-gray-400 text-xs">
                          {((params.page ?? 1) - 1) * (params.per_page ?? 10) + idx + 1}
                        </td>

                        {/* Gateway */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${style.bg} ${style.text}`}
                          >
                            {style.emoji} {config.gateway_type}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              config.is_active ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {config.is_active ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {config.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Credentials Count */}
                        <td className="px-5 py-4">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            {credCount} field{credCount !== 1 ? "s" : ""}
                          </span>
                        </td>

                        {/* Updated */}
                        <td className="px-5 py-4 text-gray-500 text-xs">
                          {new Date(config.updated_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openDetail(config)}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEdit(config)}
                              className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDelete(config)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && displayConfigs.length > 0 && (
            <div className="px-5 pb-5">
              <Pagination
                page={params.page ?? 1}
                perPage={params.per_page ?? 10}
                total={pagination.total}
                dataLength={displayConfigs.length}
                onNext={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                onPrev={() => setParams((p) => ({ ...p, page: Math.max(1, (p.page ?? 1) - 1) }))}
                onPageChange={(page) => setParams((p) => ({ ...p, page }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <PaymentGatewayConfigModal
        open={modalOpen}
        mode={modalMode}
        config={selectedConfig}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <DeleteConfirm
        open={deleteModalOpen}
        config={selectedConfig}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      <PaymentGatewayConfigDetailDrawer
        open={drawerOpen}
        config={selectedConfig}
        onClose={() => setDrawerOpen(false)}
        onEdit={() => selectedConfig && openEdit(selectedConfig)}
      />
    </div>
  );
}