export const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export const fmtMoney = (v: string | number | null | undefined) =>
  v !== null && v !== undefined
    ? `৳${parseFloat(String(v)).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`
    : "—";
