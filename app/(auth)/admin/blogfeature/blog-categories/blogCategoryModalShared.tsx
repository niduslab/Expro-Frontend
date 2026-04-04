import { BlogCategoryPayload } from "@/lib/types/admin/blogType";

export const defaultForm: BlogCategoryPayload = {
  name: "",
  name_bangla: "",
  slug: "",
  description: "",
  parent_id: null,
  order: 0,
  is_active: true,
};

export const inputClass =
  "w-full h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px]";

export const textareaClass =
  "w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[12px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px] resize-none";

export function slugify(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="pb-2">
      <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">{label}</span>
      {required && <span className="text-[#FB2C36] font-medium text-[16px]">*</span>}
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-sm text-red-500">{message}</span>;
}
