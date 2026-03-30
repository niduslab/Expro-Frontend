import { Pencil } from "lucide-react";

const InfoItem = ({
  label,
  value,
  onEdit,
}: {
  label: string;
  value?: any;
  onEdit?: () => void;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
      {label}
    </span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 px-1.5 py-0.5 rounded-md transition-colors"
        >
          <Pencil size={11} />
          Edit
        </button>
      )}
    </div>
  </div>
);

export default InfoItem;
