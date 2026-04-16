"use client";

import { Pencil } from "lucide-react";
import { BlogCategory } from "@/lib/types/admin/blogType";

interface BlogCategoryDetailModalProps {
  open: boolean;
  onClose: () => void;
  category: BlogCategory | null;
  onEdit: (category: BlogCategory) => void;
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-[12px] leading-[150%] tracking-[-0.01em] text-[#6A7282] uppercase">
        {label}
      </span>
      <span className="font-normal text-[14px] leading-[160%] tracking-[-0.01em] text-[#030712]">
        {value ?? "—"}
      </span>
    </div>
  );
}

function SectionDivider() {
  return <div className="w-full border border-[#E5E7EB]" />;
}

export default function BlogCategoryDetailModal({
  open,
  onClose,
  category,
  onEdit,
}: BlogCategoryDetailModalProps) {
  if (!open || !category) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
              Category Details
            </p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Full information for this blog category.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Section 1: Category Details */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                  Category Details
                </p>
                {category.is_active ? (
                  <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[#DCFCE7] text-[#16A34A] font-semibold text-[12px]">
                    ● Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[#FEE2E2] text-[#DC2626] font-semibold text-[12px]">
                    ● Inactive
                  </span>
                )}
              </div>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField label="Name" value={category.name} />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Name (Bangla)"
                    value={category.name_bangla}
                  />
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <span className="font-semibold text-[12px] text-[#6A7282] uppercase">
                    Slug
                  </span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1a1a2e]/8 text-[#1a1a2e] text-xs font-mono">
                      {category.slug}
                    </span>
                  </div>
                </div>
                <div className="w-1/2">
                  <DetailField label="Order" value={category.order} />
                </div>
              </div>

              {category.description && (
                <>
                  {" "}
                  <span className="font-semibold text-[12px] leading-[150%] tracking-[-0.01em] text-[#6A7282] uppercase">
                    DESCRIPTION
                  </span>{" "}
                  <div
                    className="font-normal text-[14px] leading-[160%] tracking-[-0.01em] text-[#030712]"
                    dangerouslySetInnerHTML={{
                      __html: category.description || "",
                    }}
                  ></div>
                </>
              )}

              <SectionDivider />
            </div>

            {/* Section 2: Hierarchy */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Hierarchy
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Parent Category"
                    value={category.parent?.name}
                  />
                </div>
                <div className="w-1/2">
                  <span className="font-semibold text-[12px] text-[#6A7282] uppercase">
                    Sub-categories
                  </span>
                  <div className="mt-1">
                    {category.children && category.children.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {category.children.map((child) => (
                          <span
                            key={child.id}
                            className="inline-flex px-2 py-0.5 rounded-md bg-[#d7efdc] text-[#068847] text-xs font-medium"
                          >
                            {child.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[14px] text-[#030712]">—</span>
                    )}
                  </div>
                </div>
              </div>

              <SectionDivider />
            </div>

            {/* Section 3: Record Info */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Record Info
              </p>
              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Created At"
                    value={formatDate(category.created_at)}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Last Updated"
                    value={formatDate(category.updated_at)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 flex items-center gap-[16px] px-6 py-4 border-t border-[#E5E7EB] bg-white">
          <button
            onClick={onClose}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px]"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(category)}
            className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-white flex items-center justify-center font-semibold text-[16px] gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Category</span>
          </button>
        </div>
      </div>
    </div>
  );
}
