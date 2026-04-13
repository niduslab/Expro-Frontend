export function InfoItem({ label, value }: { label: string; value?: string | React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-[#6B7280] mb-1">{label}</p>
      <p className="text-sm text-[#030712] font-medium">{value || "N/A"}</p>
    </div>
  );
}
