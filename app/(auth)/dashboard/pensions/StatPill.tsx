interface StatPillProps {
  label: string;
  value: React.ReactNode;
  sub?: string;
}

export default function StatPill({ label, value, sub }: StatPillProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3">
      <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
      <p className="text-2xl font-semibold text-[#030712] leading-none">
        {value}
      </p>
      {sub && <p className="text-[11px] text-[#9CA3AF] mt-1">{sub}</p>}
    </div>
  );
}
