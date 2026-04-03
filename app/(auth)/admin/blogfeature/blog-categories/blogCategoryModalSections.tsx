import { BlogCategoryPayload } from "@/lib/types/admin/blogType";
import { FieldLabel, FieldError, inputClass, textareaClass } from "./blogCategoryModalShared";

type Setter = (field: keyof BlogCategoryPayload, value: string | boolean | number | null) => void;

// ─── Category Details Section ──────────────────────────────────
interface CategoryDetailsSectionProps {
  formData: BlogCategoryPayload;
  errors: Record<string, string>;
  onNameChange: (value: string) => void;
  set: Setter;
}

export function CategoryDetailsSection({ formData, errors, onNameChange, set }: CategoryDetailsSectionProps) {
  return (
    <div className="flex flex-col relative top-[24px] gap-[16px]">
      <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
        Category Details
      </p>

      <div className="flex gap-2 w-full">
        <div className="w-1/2">
          <FieldLabel label="Category Name" required />
          <input className={inputClass} placeholder="e.g. Technology"
            value={formData.name} onChange={(e) => onNameChange(e.target.value)} />
          <FieldError message={errors.name} />
        </div>
        <div className="w-1/2">
          <FieldLabel label="Name (Bangla)" />
          <input className={inputClass} placeholder="e.g. প্রযুক্তি"
            value={String(formData.name_bangla ?? "")}
            onChange={(e) => set("name_bangla", e.target.value)} />
        </div>
      </div>

      <div>
        <FieldLabel label="Slug" required />
        <input className={inputClass} placeholder="e.g. technology"
          value={formData.slug}
          onChange={(e) => set("slug", e.target.value)} />
        <FieldError message={errors.slug} />
      </div>

      <div>
        <FieldLabel label="Description" />
        <textarea className={textareaClass} rows={2}
          placeholder="Brief description of this category..."
          value={String(formData.description ?? "")}
          onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="w-full border border-[#E5E7EB]" />
    </div>
  );
}

// ─── Settings Section ──────────────────────────────────────────
interface SettingsSectionProps {
  formData: BlogCategoryPayload;
  parentOptions: { id: number; name: string }[];
  set: Setter;
}

export function SettingsSection({ formData, parentOptions, set }: SettingsSectionProps) {
  return (
    <div className="flex flex-col relative top-[48px] gap-[16px]">
      <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
        Settings
      </p>

      <div className="flex gap-2 w-full">
        <div className="w-2/3">
          <FieldLabel label="Parent Category" />
          <select className={inputClass} value={formData.parent_id ?? ""}
            onChange={(e) => set("parent_id", e.target.value ? Number(e.target.value) : null)}>
            <option value="">None (Top Level)</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="w-1/3">
          <FieldLabel label="Order" />
          <input type="number" className={inputClass} placeholder="0"
            value={formData.order ?? 0}
            onChange={(e) => set("order", Number(e.target.value))} />
        </div>
      </div>

      <div>
        <FieldLabel label="Status" />
        <div className="flex items-center gap-3 h-[48px]">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer"
              checked={Boolean(formData.is_active)}
              onChange={(e) => set("is_active", e.target.checked)} />
            <div className="w-10 h-5 bg-[#D1D5DC] rounded-full peer peer-checked:bg-[#068847] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
          </label>
          <span className="text-[14px] text-[#4A5565]">
            {formData.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
}
