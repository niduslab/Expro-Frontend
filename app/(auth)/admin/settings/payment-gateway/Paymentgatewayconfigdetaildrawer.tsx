"use client";

import { X, CheckCircle2, XCircle, Calendar, Hash } from "lucide-react";
import type { PaymentGatewayConfig } from "@/lib/types/admin/Paymentgatewayconfig";

interface Props {
    open: boolean;
    config: PaymentGatewayConfig | null;
    onClose: () => void;
    onEdit: () => void;
}

export default function PaymentGatewayConfigDetailDrawer({
    open,
    config,
    onClose,
    onEdit,
}: Props) {
    if (!open || !config) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <span className="text-lg">💳</span>
                        </div>
                        <div>
                            <h2 className="text-[16px] font-semibold text-gray-900 capitalize">
                                {config.gateway_type}
                            </h2>
                            <p className="text-xs text-gray-400">ID #{config.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
                    {/* Status */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <span
                            className={`flex items-center gap-1.5 text-sm font-semibold ${
                                config.is_active ? "text-green-600" : "text-gray-400"
                            }`}
                        >
                            {config.is_active ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <XCircle className="w-4 h-4" />
                            )}
                            {config.is_active ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Hash className="w-3 h-3" /> ID
                            </div>
                            <p className="text-sm font-semibold text-gray-800">{config.id}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                <Calendar className="w-3 h-3" /> Created
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                                {new Date(config.created_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Credentials */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Credentials</p>
                        {config.credentials && Object.keys(config.credentials).length ? (
                            <div className="space-y-2">
                                {Object.entries(config.credentials).map(([key, val]) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50"
                                    >
                                        <span className="text-xs font-mono font-medium text-gray-500">
                                            {key}
                                        </span>
                                        <span className="text-xs font-mono text-gray-800 truncate max-w-[55%]">
                                            {typeof val === "boolean"
                                                ? val ? "true" : "false"
                                                : "•".repeat(Math.min(String(val).length, 16))}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No credentials stored</p>
                        )}
                    </div>

                    {/* Updated At */}
                    <p className="text-xs text-gray-400">
                        Last updated:{" "}
                        {new Date(config.updated_at).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={onEdit}
                        className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                    >
                        Edit Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}