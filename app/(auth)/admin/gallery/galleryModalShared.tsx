import {
  CreateGalleryPayload,
  GalleryStatus,
} from "@/lib/types/admin/galleryType";

export function resolveImageUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Prepend your Laravel storage base URL
  return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`;
}

export const defaultGalleryForm: CreateGalleryPayload = {
  title: "",
  slug: "",
  description: "",
  cover_image: null,
  is_featured: false,
  status: "draft",
};

export const GALLERY_STATUS_OPTIONS: { label: string; value: GalleryStatus }[] =
  [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" },
  ];

export const inputClass =
  "w-full h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px]";

export const textareaClass =
  "w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[12px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px] resize-none";

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <div className="pb-2">
      <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
        {label}
      </span>
      {required && (
        <span className="text-[#FB2C36] font-medium text-[16px]">*</span>
      )}
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-sm text-red-500">{message}</span>;
}

export function Divider() {
  return <div className="w-full border border-[#E5E7EB]" />;
}
