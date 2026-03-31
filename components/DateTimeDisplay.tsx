"use client";

interface DateDisplayProps {
  date?: string | Date | null;
  showTime?: boolean;
  format?: Intl.DateTimeFormatOptions;
  emptyPlaceholder?: string;
}

const DateDisplay = ({
  date,
  showTime = false,
  format,
  emptyPlaceholder = "—",
}: DateDisplayProps) => {
  if (!date) return <span className="text-gray-400">{emptyPlaceholder}</span>;

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime()))
    return <span className="text-gray-400">{emptyPlaceholder}</span>;

  const dateFormatted = d.toLocaleString(
    "en-GB",
    format || {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  const timeFormatted = showTime
    ? d.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{dateFormatted}</span>
      {timeFormatted && (
        <span className="text-xs text-gray-400">{timeFormatted}</span>
      )}
    </span>
  );
};

export default DateDisplay;
