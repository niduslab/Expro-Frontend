"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone, Check, X, Loader2, Info } from "lucide-react";
import { useNotificationPreferences } from "@/lib/hooks/useNotificationPreferences";
import { toast } from "sonner";

// Notification type metadata
const NOTIFICATION_TYPES = [
  {
    type: "payment_success",
    label: "Payment Success",
    description: "Notifications when a payment is successfully processed",
    icon: "✅",
    category: "Payments",
  },
  {
    type: "payment_failed",
    label: "Payment Failed",
    description: "Alerts when a payment fails or is declined",
    icon: "❌",
    category: "Payments",
  },
  {
    type: "commission_alert",
    label: "Commission Earned",
    description: "Notifications when you earn a commission",
    icon: "💰",
    category: "Commissions",
  },
  {
    type: "pension_update",
    label: "Pension Updates",
    description: "Updates about your pension status and changes",
    icon: "ℹ️",
    category: "Pensions",
  },
  {
    type: "membership_approved",
    label: "Membership Approved",
    description: "Notification when your membership application is approved",
    icon: "✅",
    category: "Membership",
  },
  {
    type: "membership_rejected",
    label: "Membership Rejected",
    description: "Notification when your membership application is rejected",
    icon: "❌",
    category: "Membership",
  },
  {
    type: "system_announcement",
    label: "System Announcements",
    description: "Important system-wide announcements and updates",
    icon: "📢",
    category: "System",
  },
  {
    type: "wallet_transaction",
    label: "Wallet Transactions",
    description: "Notifications for wallet deposits, withdrawals, and transfers",
    icon: "💳",
    category: "Wallet",
  },
  {
    type: "document_uploaded",
    label: "Document Uploads",
    description: "Alerts when documents are uploaded or require action",
    icon: "📄",
    category: "Documents",
  },
  {
    type: "event_reminder",
    label: "Event Reminders",
    description: "Reminders for upcoming events and meetings",
    icon: "📅",
    category: "Events",
  },
];

const CHANNELS = [
  { key: "email_enabled" as const, label: "Email", icon: Mail, color: "text-blue-600" },
  { key: "sms_enabled" as const, label: "SMS", icon: MessageSquare, color: "text-green-600" },
  { key: "push_enabled" as const, label: "Push", icon: Smartphone, color: "text-purple-600" },
  { key: "in_app_enabled" as const, label: "In-App", icon: Bell, color: "text-orange-600" },
];

export default function NotificationSettingsPage() {
  const { preferences, isLoading, updatePreference } = useNotificationPreferences();
  const [updatingStates, setUpdatingStates] = useState<Record<string, boolean>>({});

  const handleToggle = async (
    notificationType: string,
    channel: "email_enabled" | "sms_enabled" | "push_enabled" | "in_app_enabled",
    currentValue: boolean
  ) => {
    const key = `${notificationType}-${channel}`;
    setUpdatingStates(prev => ({ ...prev, [key]: true }));

    try {
      await updatePreference(notificationType, channel, !currentValue);
      toast.success(`${channel.replace("_enabled", "").toUpperCase()} notifications ${!currentValue ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update preference. Please try again.");
    } finally {
      setUpdatingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const getPreferenceValue = (notificationType: string, channel: string): boolean => {
    const pref = preferences.find(p => p.notification_type === notificationType);
    return pref ? (pref as any)[channel] : true; // Default to enabled
  };

  const isUpdating = (notificationType: string, channel: string): boolean => {
    return updatingStates[`${notificationType}-${channel}`] || false;
  };

  // Group notifications by category
  const groupedNotifications = NOTIFICATION_TYPES.reduce((acc, notif) => {
    if (!acc[notif.category]) {
      acc[notif.category] = [];
    }
    acc[notif.category].push(notif);
    return acc;
  }, {} as Record<string, typeof NOTIFICATION_TYPES>);

  if (isLoading) {
    return (
      <div className="container flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Notification Settings
          </p>
          <p className="text-sm text-[#4A5565]">
            Manage how you receive notifications
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#068847]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
          Notification Settings
        </p>
        <p className="text-sm text-[#4A5565]">
          Control how and when you receive notifications across different channels
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900 mb-1">
            About Notification Channels
          </p>
          <p className="text-xs text-blue-700">
            <strong>Email:</strong> Sent to your registered email address. 
            <strong className="ml-3">SMS:</strong> Sent to your phone number (carrier charges may apply). 
            <strong className="ml-3">Push:</strong> Browser/mobile app notifications. 
            <strong className="ml-3">In-App:</strong> Notifications within the platform.
          </p>
        </div>
      </div>

      {/* Channel Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-6">
          {CHANNELS.map(channel => {
            const Icon = channel.icon;
            return (
              <div key={channel.key} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${channel.color}`} />
                <span className="text-sm font-medium text-gray-700">{channel.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Preferences by Category */}
      {Object.entries(groupedNotifications).map(([category, notifications]) => (
        <div key={category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Category Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900">{category}</h3>
          </div>

          {/* Notifications Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Notification Type
                  </th>
                  {CHANNELS.map(channel => (
                    <th key={channel.key} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-1">
                        <channel.icon className={`w-3.5 h-3.5 ${channel.color}`} />
                        <span>{channel.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notifications.map(notif => (
                  <tr key={notif.type} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{notif.icon}</span>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{notif.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>
                        </div>
                      </div>
                    </td>
                    {CHANNELS.map(channel => {
                      const isEnabled = getPreferenceValue(notif.type, channel.key);
                      const updating = isUpdating(notif.type, channel.key);

                      return (
                        <td key={channel.key} className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleToggle(notif.type, channel.key, isEnabled)}
                            disabled={updating}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#068847] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                              isEnabled ? "bg-[#068847]" : "bg-gray-300"
                            }`}
                          >
                            <span className="sr-only">
                              {isEnabled ? "Disable" : "Enable"} {channel.label} for {notif.label}
                            </span>
                            {updating ? (
                              <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white animate-spin" />
                            ) : (
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  isEnabled ? "translate-x-6" : "translate-x-1"
                                }`}
                              >
                                {isEnabled ? (
                                  <Check className="w-3 h-3 text-[#068847] m-auto mt-0.5" />
                                ) : (
                                  <X className="w-3 h-3 text-gray-400 m-auto mt-0.5" />
                                )}
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Footer Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Changes are saved automatically. Some notifications may be required for security or legal reasons and cannot be disabled. 
          SMS notifications may incur carrier charges depending on your mobile plan.
        </p>
      </div>
    </div>
  );
}
