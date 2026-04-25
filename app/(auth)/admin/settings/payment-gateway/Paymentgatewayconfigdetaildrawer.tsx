"use client";

import { X, CheckCircle2, XCircle, Calendar, Hash, Eye, EyeOff, Wallet } from "lucide-react";
import { useState } from "react";
import type { PaymentGatewayConfig } from "@/lib/types/admin/Paymentgatewayconfig";

interface Props {
    open: boolean;
    config: PaymentGatewayConfig | null;
    onClose: () => void;
    onEdit: () => void;
}

export default function PaymentGatewayConfigDetailModal({
    open,
    config,
    onClose,
    onEdit,
}: Props) {
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

    const toggleKey = (key: string) => {
        setVisibleKeys((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

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
                            <span className="text-lg"><Wallet/></span>
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
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-700">Credentials</p>
                            {config.credentials && Object.keys(config.credentials).length > 0 && (
                                <button
                                    onClick={() => {
                                        const allKeys = Object.keys(config.credentials ?? {});
                                        const allVisible = allKeys.every((k) => visibleKeys.has(k));
                                        setVisibleKeys(allVisible ? new Set() : new Set(allKeys));
                                    }}
                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition"
                                >
                                    {Object.keys(config.credentials ?? {}).every((k) =>
                                        visibleKeys.has(k)
                                    ) ? (
                                        <>
                                            <EyeOff className="w-3.5 h-3.5" /> Hide all
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-3.5 h-3.5" /> Show all
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {config.credentials && Object.keys(config.credentials).length ? (
                            <div className="space-y-2">
                                {Object.entries(config.credentials).map(([key, val]) => {
                                    const isVisible = visibleKeys.has(key);
                                    const displayVal =
                                        typeof val === "boolean"
                                            ? val
                                                ? "true"
                                                : "false"
                                            : String(val);

                                    return (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 group"
                                        >
                                            {/* Key */}
                                            <span className="text-xs font-mono font-medium text-gray-500 shrink-0">
                                                {key}
                                            </span>

                                            {/* Value + Toggle */}
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span
                                                    className={`text-xs font-mono truncate transition-all ${
                                                        isVisible
                                                            ? "text-gray-800"
                                                            : "text-gray-400 tracking-widest"
                                                    }`}
                                                >
                                                    {isVisible
                                                        ? displayVal
                                                        : "•".repeat(
                                                              Math.min(displayVal.length, 14)
                                                          )}
                                                </span>
                                                <button
                                                    onClick={() => toggleKey(key)}
                                                    className="shrink-0 p-1 rounded text-gray-300 hover:text-gray-600 hover:bg-gray-200 transition"
                                                    title={isVisible ? "Hide" : "Show"}
                                                >
                                                    {isVisible ? (
                                                        <EyeOff className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <Eye className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
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