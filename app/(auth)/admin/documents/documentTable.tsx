"use client";

import { Document } from "@/lib/types/admin/documentType";
import { Eye, Pencil, Trash2, Download, FileText } from "lucide-react";

interface DocumentTableProps {
  documents: Document[];
  deletingId: number | null;
  onView: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: number) => void;
  onDownload: (doc: Document) => void;
}

function StatusBadge({ status }: { status: Document["status"] }) {
  const map = {
    active: "bg-emerald-50 text-emerald-700",
    inactive: "bg-red-50 text-red-600",
    archived: "bg-gray-100 text-gray-600",
  };
  const labels = { active: "Active", inactive: "Inactive", archived: "Archived" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${map[status] ?? map.inactive}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[status] ?? status}
    </span>
  );
}

function TypeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1a1a2e]/8 text-[#1a1a2e] text-xs font-mono font-semibold">
      {label}
    </span>
  );
}

export default function DocumentTable({
  documents,
  deletingId,
  onView,
  onEdit,
  onDelete,
  onDownload,
}: DocumentTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-[#e3e8e0] bg-[#f8faf7]">
            {["Name", "Type", "Size", "Downloads", "Status", "Featured", "Actions"].map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-xs font-semibold text-[#8a8780] uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0ede8]">
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="hover:bg-[#f8faf7] transition-colors group"
            >
              {/* Name */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#068847]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1a1a2e] truncate max-w-[200px]">
                      {doc.name}
                    </p>
                    <p className="text-xs text-[#8a8780] truncate max-w-[200px]">
                      {doc.file_name}
                    </p>
                  </div>
                </div>
              </td>

              {/* Type */}
              <td className="px-5 py-4 whitespace-nowrap">
                <TypeBadge label={doc.type_label} />
              </td>

              {/* Size */}
              <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                {doc.file_size_formatted}
              </td>

              {/* Downloads */}
              <td className="px-5 py-4 text-sm text-[#4a4845] whitespace-nowrap">
                {doc.download_count.toLocaleString()}
              </td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <StatusBadge status={doc.status} />
              </td>

              {/* Featured */}
              <td className="px-5 py-4 whitespace-nowrap">
                {doc.is_featured ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                    ★ Featured
                  </span>
                ) : (
                  <span className="text-xs text-[#8a8780]">—</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onView(doc)}
                    className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDownload(doc)}
                    className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#068847] transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(doc)}
                    className="p-1.5 rounded-lg hover:bg-[#f0ede8] text-[#8a8780] hover:text-[#1a1a2e] transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="p-1.5 rounded-lg hover:bg-[#FEE2E2] text-[#8a8780] hover:text-[#DC2626] transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
