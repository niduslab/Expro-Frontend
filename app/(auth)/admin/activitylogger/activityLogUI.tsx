// ─── Types ────────────────────────────────────────────────────────────────────
export type SortKey = "created_at" | "log_name" | "causer_id";
export type SortDir = "asc" | "desc";

// ─── Constants ────────────────────────────────────────────────────────────────
export const LOG_NAME_COLORS: Record<
  string,
  { bg: string; color: string; dot: string }
> = {
  auth: { bg: "#E0E7FF", color: "#4338CA", dot: "bg-[#4338CA]" },
  admin: { bg: "#FEF3C7", color: "#92400E", dot: "bg-[#F59E0B]" },
  default: { bg: "#F3F4F6", color: "#374151", dot: "bg-gray-500" },
  system: { bg: "#CCFBF1", color: "#0F766E", dot: "bg-[#0D9488]" },
  payment: { bg: "#ECFCCB", color: "#3A5C11", dot: "bg-[#65A30D]" },
  error: { bg: "#FEE2E2", color: "#991B1B", dot: "bg-[#DC2626]" },
};

export const AVATAR_COLORS = [
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#E1F5EE", color: "#0F6E56" },
  { bg: "#FAECE7", color: "#993C1D" },
  { bg: "#E6F1FB", color: "#185FA5" },
  { bg: "#FAEEDA", color: "#854F0B" },
  { bg: "#EAF3DE", color: "#3B6D11" },
  { bg: "#FBEAF0", color: "#993556" },
];

// ─── Primitives ───────────────────────────────────────────────────────────────
export function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      style={{ background: c.bg, color: c.color }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0"
    >
      {initials}
    </div>
  );
}

export function LogNameBadge({ name }: { name: string }) {
  const cfg = LOG_NAME_COLORS[name] ?? LOG_NAME_COLORS.default;
  return (
    <span
      style={{ background: cfg.bg, color: cfg.color }}
      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </span>
  );
}

export function SortChevron({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) {
  return (
    <span
      className={`ml-1 text-[10px] ${active ? "text-[#068847]" : "text-gray-300"}`}
    >
      {active && dir === "desc" ? "▼" : "▲"}
    </span>
  );
}

export function StatCard({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-[#F5F4ED] rounded-xl p-4">
      <p className="text-[14px] font-[600] mb-1">{label}</p>
      <p className={`text-[20px] font-[700] ${valueColor ?? "text-gray-900"}`}>
        {value}
      </p>
      <p className="text-[16px] font-[400] text-gray-600 mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Modal value renderer ─────────────────────────────────────────────────────
function renderValue(val: any): React.ReactNode {
  if (val === null || val === undefined)
    return <span className="text-gray-400 italic text-[12px]">null</span>;
  if (typeof val === "boolean")
    return (
      <span
        className={`text-[12px] font-medium ${val ? "text-[#0F766E]" : "text-[#DC2626]"}`}
      >
        {val.toString()}
      </span>
    );
  if (typeof val === "number")
    return (
      <span className="text-[12px] font-medium text-[#4338CA]">{val}</span>
    );
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) {
      const d = new Date(val);
      return (
        <span className="text-[12px] text-[#854F0B]">
          {d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {" · "}
          {d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    }
    return <span className="text-[12px] text-gray-800 break-all">{val}</span>;
  }
  return (
    <span className="text-[12px] text-gray-500 italic">
      {JSON.stringify(val)}
    </span>
  );
}

// ─── Properties Modal (redesigned) ───────────────────────────────────────────
export interface ModalLogData {
  properties: Record<string, any>;
  description: string;
  logName?: string;
  event?: string | null;
  ipAddress?: string | null;
  createdAt?: string;
}

export function PropertiesModal({
  properties,
  description,
  logName,
  event,
  ipAddress,
  createdAt,
  onClose,
}: ModalLogData & { onClose: () => void }) {
  const entries = Object.entries(properties);
  const metaKeys = [
    "id",
    "created_at",
    "updated_at",
    "deleted_at",
    "author_id",
    "category_id",
  ];
  const metaEntries = entries.filter(([k]) => metaKeys.includes(k));
  const contentEntries = entries.filter(([k]) => !metaKeys.includes(k));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#F3F4F6]">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">
              Log Details
            </h3>
            <p className="text-[12px] text-gray-500 mt-0.5">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors cursor-pointer ml-4 flex-shrink-0"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Meta strip */}
        {(logName || event || ipAddress || createdAt) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2.5 bg-[#F9FAFB] border-b border-[#F3F4F6]">
            {logName && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400">Channel</span>
                <LogNameBadge name={logName} />
              </div>
            )}
            {event && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400">Event</span>
                <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {event}
                </span>
              </div>
            )}
            {ipAddress && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400">IP</span>
                <span className="text-[11px] font-mono font-medium text-gray-700">
                  {ipAddress}
                </span>
              </div>
            )}
            {createdAt && (
              <span className="text-[11px] text-gray-400 ml-auto">
                {new Date(createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-3">
          {entries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[13px] text-gray-400">
                No additional properties recorded
              </p>
            </div>
          ) : (
            <>
              {contentEntries.length > 0 && (
                <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <div className="px-4 py-2 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Properties
                    </p>
                  </div>
                  <div className="divide-y divide-[#F9FAFB]">
                    {contentEntries.map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-start gap-4 px-4 py-2.5 hover:bg-[#FAFAFA]"
                      >
                        <span className="text-[12px] text-gray-400 w-[130px] flex-shrink-0 pt-px capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="flex-1">{renderValue(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {metaEntries.length > 0 && (
                <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <div className="px-4 py-2 bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Metadata
                    </p>
                  </div>
                  <div className="divide-y divide-[#F9FAFB]">
                    {metaEntries.map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-start gap-4 px-4 py-2.5 hover:bg-[#FAFAFA]"
                      >
                        <span className="text-[12px] text-gray-400 w-[130px] flex-shrink-0 pt-px capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="flex-1">{renderValue(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
export function DownloadIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function RefreshIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
