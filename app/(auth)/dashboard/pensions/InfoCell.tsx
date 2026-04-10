interface InfoCellProps {
  label: string;
  value?: React.ReactNode;
}

export default function InfoCell({ label, value }: InfoCellProps) {
  return (
    <div>
      <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-[13px] font-medium text-[#030712]">
        {value ?? <span className="text-[#D1D5DB] font-normal">—</span>}
      </p>
    </div>
  );
}
