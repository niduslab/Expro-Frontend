"use client";

import { useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Filter,
  Search,
  Download,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNotificationLogs, useNotificationAnalytics } from "@/lib/hooks/admin/useNotificationLogs";
import { toast } from "sonner";

const CHANNEL_ICONS = {
  email: { icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  sms: { icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
  push: { icon: Smartphone, color: "text-purple-600", bg: "bg-purple-50" },
  in_app: { icon: Bell, color: "text-orange-600", bg: "bg-orange-50" },
};

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", label: "Pending" },
  sent: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50", label: "Sent" },
  delivered: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Delivered" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Failed" },
  read: { icon: CheckCircle, color: "text-[#068847]", bg: "bg-green-50", label: "Read" },
};

export default function NotificationLogsPage() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const { analytics, isLoading: analyticsLoading } = useNotificationAnalytics(dateRange);
  const {
    logs,
    pagination,
    filters,
    isLoading: logsLoading,
    updateFilters,
    changePage,
    resetFilters,
  } = useNotificationLogs();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    updateFilters({ search: searchQuery, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ [key]: value || undefined, page: 1 });
  };

  const handleExport = () => {
    toast.info("Export functionality coming soon");
    // TODO: Implement CSV/Excel export
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return `৳${amount.toFixed(2)}`;
  };

  return (
    <div className="container flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Notification Analytics
          </h1>
          <p className="text-sm text-[#4A5565] mt-1">
            Monitor notification delivery, performance, and system health
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#068847] text-white rounded-lg text-sm font-medium hover:bg-[#057a3d] transition-colors flex items-center gap-2 w-fit"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Analytics Cards */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Sent */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Sent</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.total_sent.toLocaleString()}</p>
          </div>

          {/* Delivery Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Delivery Rate</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.delivery_rate.toFixed(1)}%</p>
          </div>

          {/* Failed */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              {analytics.failure_rate > 5 ? (
                <TrendingUp className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-600" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Failed</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.total_failed.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{analytics.failure_rate.toFixed(1)}% failure rate</p>
          </div>

          {/* Total Cost */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Cost</p>
            <p className="text-3xl font-bold text-gray-900">৳{analytics.total_cost.toFixed(2)}</p>
          </div>
        </div>
      ) : null}

      {/* Distribution Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* By Channel */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">By Channel</h3>
            <div className="space-y-3">
              {Object.entries(analytics.by_channel).map(([channel, count]) => {
                const config = CHANNEL_ICONS[channel as keyof typeof CHANNEL_ICONS];
                const Icon = config?.icon || Bell;
                const percentage = ((count / analytics.total_sent) * 100).toFixed(1);
                
                return (
                  <div key={channel} className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${config?.bg || 'bg-gray-50'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config?.color || 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 capitalize">{channel.replace('_', ' ')}</span>
                        <span className="text-sm text-gray-600">{count.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${config?.color.replace('text', 'bg') || 'bg-gray-600'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">By Status</h3>
            <div className="space-y-3">
              {Object.entries(analytics.by_status).map(([status, count]) => {
                const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                const Icon = config?.icon || AlertCircle;
                const percentage = ((count / analytics.total_sent) * 100).toFixed(1);
                
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${config?.bg || 'bg-gray-50'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config?.color || 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 capitalize">{config?.label || status}</span>
                        <span className="text-sm text-gray-600">{count.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${config?.color.replace('text', 'bg') || 'bg-gray-600'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name, email, or notification type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#068847] text-white rounded-lg text-sm font-medium hover:bg-[#057a3d] transition-colors whitespace-nowrap"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-200">
              <select
                value={filters.channel || ""}
                onChange={(e) => handleFilterChange("channel", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              >
                <option value="">All Channels</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push</option>
                <option value="in_app">In-App</option>
              </select>

              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="read">Read</option>
              </select>

              <input
                type="date"
                value={filters.date_from || ""}
                onChange={(e) => handleFilterChange("date_from", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="From Date"
              />

              <input
                type="date"
                value={filters.date_to || ""}
                onChange={(e) => handleFilterChange("date_to", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="To Date"
              />

              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Notification
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sent At
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logsLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#068847]" />
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No notification logs found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const channelConfig = CHANNEL_ICONS[log.channel];
                  const statusConfig = STATUS_CONFIG[log.status];
                  const ChannelIcon = channelConfig?.icon || Bell;
                  const StatusIcon = statusConfig?.icon || AlertCircle;

                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{log.user?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{log.user?.email || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{log.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{log.message}</p>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{log.notification_type.replace(/_/g, " ")}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50">
                          <ChannelIcon className={`w-3.5 h-3.5 ${channelConfig?.color || 'text-gray-600'}`} />
                          <span className="text-xs font-medium text-gray-700 capitalize">{log.channel.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig?.bg || 'bg-gray-50'}`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${statusConfig?.color || 'text-gray-600'}`} />
                          <span className={`text-xs font-medium ${statusConfig?.color || 'text-gray-700'}`}>
                            {statusConfig?.label || log.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{formatDate(log.sent_at)}</p>
                        {log.error_message && (
                          <p className="text-xs text-red-600 mt-1 line-clamp-1" title={log.error_message}>
                            {log.error_message}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(log.cost)}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changePage(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.last_page))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        pagination.current_page === page
                          ? "bg-[#068847] text-white"
                          : "border border-gray-300 hover:bg-white"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => changePage(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
