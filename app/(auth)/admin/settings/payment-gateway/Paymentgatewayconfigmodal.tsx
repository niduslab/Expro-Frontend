"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import type {
    PaymentGatewayConfig,
    CreatePaymentGatewayConfigPayload,
    UpdatePaymentGatewayConfigPayload,
} from "@/lib/types/admin/Paymentgatewayconfig";
import { CustomSelect } from "../../projects/projectMember/[id]/Projectmemberui";

// ─── Constants ────────────────────────────────────────────────────────────────

const GATEWAY_OPTIONS = [
    { label: "bKash", value: "bkash" },
    { label: "Nagad", value: "nagad" },
    { label: "Rocket", value: "rocket" },
    { label: "Stripe", value: "stripe" },
    { label: "PayPal", value: "paypal" },
];

const STATUS_OPTIONS = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
];

/**
 * Required credential keys per gateway type.
 * These must match the backend validation rules exactly.
 */
const GATEWAY_CREDENTIAL_TEMPLATES: Record<string, string[]> = {
    bkash: ["app_key", "app_secret", "username", "password", "sandbox_mode"],
    nagad: ["merchant_id", "merchant_number", "public_key", "private_key", "sandbox_mode"],
    rocket: ["merchant_id", "api_key", "sandbox_mode"],
    stripe: ["publishable_key", "secret_key", "webhook_secret"],
    paypal: ["client_id", "client_secret", "sandbox_mode"],
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "create" | "edit";

interface Props {
    open: boolean;
    mode: Mode;
    config?: PaymentGatewayConfig | null;
    isSubmitting: boolean;
    onClose: () => void;
    onCreate: (payload: CreatePaymentGatewayConfigPayload) => void;
    onUpdate: (payload: UpdatePaymentGatewayConfigPayload) => void;
}

interface CredentialRow {
    key: string;
    value: string;
    isRequired: boolean; // marks template-defined fields
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const credentialsToRows = (
    creds: Record<string, string>,
    requiredKeys: string[] = []
): CredentialRow[] =>
    Object.entries(creds).map(([key, value]) => ({
        key,
        value,
        isRequired: requiredKeys.includes(key),
    }));

const rowsToCredentials = (rows: CredentialRow[]): Record<string, string | boolean> =>
    rows.reduce(
        (acc, r) => {
            if (r.key.trim()) {
                const val = r.value.trim();
                // Cast sandbox_mode (and any boolean-like field) to real boolean
                if (r.key === "sandbox_mode") {
                    acc[r.key] = val === "true" || val === "1";
                } else {
                    acc[r.key] = val;
                }
            }
            return acc;
        },
        {} as Record<string, string | boolean>
    );
/**
 * Build default credential rows from a gateway's template keys.
 * Existing values are preserved when switching to edit mode.
 */
const buildTemplateRows = (
    gatewayType: string,
    existingCreds: Record<string, string> = {}
): CredentialRow[] => {
    const templateKeys = GATEWAY_CREDENTIAL_TEMPLATES[gatewayType] ?? [];

    const templateRows: CredentialRow[] = templateKeys.map((key) => ({
        key,
        value: existingCreds[key] ?? "",
        isRequired: true,
    }));

    // Append any extra keys that exist in saved credentials but are not in the template
    const extraRows: CredentialRow[] = Object.entries(existingCreds)
        .filter(([key]) => !templateKeys.includes(key))
        .map(([key, value]) => ({ key, value, isRequired: false }));

    return templateRows.length > 0
        ? [...templateRows, ...extraRows]
        : [{ key: "", value: "", isRequired: false }];
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentGatewayConfigModal({
    open,
    mode,
    config,
    isSubmitting,
    onClose,
    onCreate,
    onUpdate,
}: Props) {
    const [gatewayType, setGatewayType] = useState("");
    const [isActive, setIsActive] = useState("true");
    const [credRows, setCredRows] = useState<CredentialRow[]>([
        { key: "", value: "", isRequired: false },
    ]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ── Populate form on open / mode change ──
    useEffect(() => {
        if (mode === "edit" && config) {
            setGatewayType(config.gateway_type);
            setIsActive(String(config.is_active));
            setCredRows(
                buildTemplateRows(
                    config.gateway_type,
                    Object.fromEntries(
                        Object.entries(config.credentials ?? {}).map(([k, v]) => [k, String(v)])
                    )
                )
            );
        } else {
            setGatewayType("");
            setIsActive("true");
            setCredRows([{ key: "", value: "", isRequired: false }]);
        }
        setErrors({});
    }, [open, mode, config]);

    // ── Re-build credential rows when gateway type changes (create mode) ──
    const handleGatewayTypeChange = (val: string) => {
        setGatewayType(val);
        setCredRows(buildTemplateRows(val));
        setErrors((prev) => ({ ...prev, gatewayType: "", credentials: "" }));
    };

    if (!open) return null;

    // ── Credential row helpers ──
    const updateRow = (idx: number, field: "key" | "value", val: string) => {
        setCredRows((prev) =>
            prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
        );
    };

    const addRow = () =>
        setCredRows((prev) => [...prev, { key: "", value: "", isRequired: false }]);

    const removeRow = (idx: number) =>
        setCredRows((prev) => prev.filter((_, i) => i !== idx));

    // ── Validation ──
    const validate = () => {
        const e: Record<string, string> = {};

        if (mode === "create" && !gatewayType) {
            e.gatewayType = "Gateway type is required";
        }

        // Check that all required (template) fields have a value
        const emptyRequired = credRows.filter((r) => r.isRequired && !r.value.trim());
        if (emptyRequired.length > 0) {
            e.credentials = `Required fields missing: ${emptyRequired.map((r) => r.key).join(", ")}`;
        } else {
            const creds = rowsToCredentials(credRows);
            if (!Object.keys(creds).length) {
                e.credentials = "At least one credential key is required";
            }
        }

        setErrors(e);
        return !Object.keys(e).length;
    };

    // ── Submit ──
    const handleSubmit = () => {
        if (!validate()) return;
        const credentials = rowsToCredentials(credRows);
        if (mode === "create") {
            onCreate({ gateway_type: gatewayType, is_active: isActive === "true", credentials });
        } else {
            onUpdate({ is_active: isActive === "true", credentials });
        }
    };

    const requiredKeys = GATEWAY_CREDENTIAL_TEMPLATES[gatewayType] ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-[17px] font-semibold text-gray-900">
                            {mode === "create" ? "Add Gateway Configuration" : "Edit Gateway Configuration"}
                        </h2>
                        {mode === "edit" && config && (
                            <p className="text-sm text-gray-400 mt-0.5 capitalize">{config.gateway_type}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Gateway Type (create only) */}
                    {mode === "create" && (
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">
                                Gateway Type <span className="text-red-500">*</span>
                            </label>
                            <CustomSelect
                                value={gatewayType}
                                onChange={handleGatewayTypeChange}
                                options={GATEWAY_OPTIONS}
                                error={!!errors.gatewayType}
                            />
                            {errors.gatewayType && (
                                <p className="text-xs text-red-500">{errors.gatewayType}</p>
                            )}
                        </div>
                    )}

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <CustomSelect
                            value={isActive}
                            onChange={setIsActive}
                            options={STATUS_OPTIONS}
                        />
                    </div>

                    {/* Credentials */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                                Credentials <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addRow}
                                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Field
                            </button>
                        </div>

                        {/* Column headers */}
                        <div className="grid grid-cols-2 gap-2 px-1">
                            <span className="text-xs text-gray-400 font-medium">Key</span>
                            <span className="text-xs text-gray-400 font-medium">Value</span>
                        </div>

                        <div className="space-y-2">
                            {credRows.map((row, idx) => {
                                const isRequired = requiredKeys.includes(row.key);
                                return (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="Key (e.g. app_key)"
                                            value={row.key}
                                            onChange={(e) => updateRow(idx, "key", e.target.value)}
                                            readOnly={row.isRequired}
                                            className={`flex-1 h-[44px] border rounded-[8px] px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring focus:ring-green-500 focus:border-transparent transition ${row.isRequired
                                                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-default"
                                                : "border-[#D1D5DC]"
                                                }`}
                                        />
                                        <div className="flex-1 relative">
                                            {row.key === "sandbox_mode" ? (
                                                <select
                                                    value={row.value}
                                                    onChange={(e) => updateRow(idx, "value", e.target.value)}
                                                    className={`w-full h-[44px] border rounded-[8px] px-4 text-sm text-gray-800 focus:outline-none focus:ring focus:ring-green-500 focus:border-transparent transition appearance-none ${isRequired && !row.value
                                                        ? "border-red-300 bg-red-50/40"
                                                        : "border-[#D1D5DC]"
                                                        }`}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="true">Yes (Sandbox)</option>
                                                    <option value="false">No (Live)</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder="Value"
                                                    value={row.value}
                                                    onChange={(e) => updateRow(idx, "value", e.target.value)}
                                                    className={`w-full h-[44px] border rounded-[8px] px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring focus:ring-green-500 focus:border-transparent transition ${isRequired && !row.value.trim()
                                                        ? "border-red-300 bg-red-50/40"
                                                        : "border-[#D1D5DC]"
                                                        }`}
                                                />
                                            )}
                                          
                                        </div>
                                        {/* Only allow removing non-required rows */}
                                        {!row.isRequired && credRows.length > 1 ? (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(idx)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <div className="w-8 shrink-0" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {errors.credentials && (
                            <p className="text-xs text-red-500">{errors.credentials}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-60 flex items-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {mode === "create" ? "Create" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}