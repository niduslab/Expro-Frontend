"use client";

import { useEffect, useState } from "react";
import { Event, EventPayload, EventStatus } from "@/lib/types/admin/eventType";
import {
  useCreateEvent,
  useUpdateEvent,
} from "@/lib/hooks/admin/useEventsHook";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CustomSelect from "@/components/admin/CustomSelect";
// Allowed MIME types for images
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/svg+xml", // Note: SVGs are often blocked by servers for security, but valid in browser
  "image/webp",
];

// Max size in bytes (e.g., 5MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Helper to get file extension from MIME type or name
const getFileExtension = (file: File) => {
  return file.name.split(".").pop()?.toLowerCase();
};
interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: Event | null;
}

const defaultForm: EventPayload = {
  project_id: null,
  title: "",
  description: null,
  location: null,
  start_date: "",
  end_date: null,
  status: "draft",
  max_attendees: null,
  registration_fee: null,
  image: null,
  metadata: null,
};

const STATUS_OPTIONS: { label: string; value: EventStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
];

const inputClass =
  "w-full h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px]";

const textareaClass =
  "w-full border border-[#D1D5DC] rounded-[8px] px-[16px] py-[12px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px] resize-none";

const selectClass =
  "w-full h-[48px] border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282] text-[14px]";

function FieldLabel({
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
        <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
          *
        </span>
      )}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-sm text-red-500 mt-1 block">{message}</span>;
}

// Format a datetime string or Date to "YYYY-MM-DDTHH:mm" for datetime-local input
function toDatetimeLocal(val?: string | null): string {
  if (!val) return "";
  try {
    const d = new Date(val);
    // toISOString is always UTC; slice to "YYYY-MM-DDTHH:mm"
    return d.toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

export default function EventModal({ open, onClose, event }: EventModalProps) {
  const isEdit = !!event;

  const [formData, setFormData] = useState<EventPayload>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (open && event) {
      setFormData({
        project_id: event.project_id ?? null,
        title: event.title,
        description: event.description ?? null,
        location: event.location ?? null,
        start_date: toDatetimeLocal(event.start_date),
        end_date: toDatetimeLocal(event.end_date),
        status: event.status,
        max_attendees: event.max_attendees ?? null,
        registration_fee: event.registration_fee ?? null,
        image: event.image ?? null,
        metadata: null,
      });
    } else if (open && !event) {
      setFormData(defaultForm);
    }
    setImageFile(null);
    setErrors({});
  }, [open, event]);

  const setField = (field: keyof EventPayload, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // ... existing title/date validations ...
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.status) newErrors.status = "Status is required";

    // ... existing date logic ...
    if (
      formData.end_date &&
      formData.start_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      newErrors.end_date = "End date must be after start date";
    }

    // ... existing number validations ...
    if (
      formData.max_attendees !== null &&
      formData.max_attendees !== undefined &&
      Number(formData.max_attendees) < 1
    ) {
      newErrors.max_attendees = "Max attendees must be at least 1";
    }
    if (
      formData.registration_fee !== null &&
      formData.registration_fee !== undefined &&
      Number(formData.registration_fee) < 0
    ) {
      newErrors.registration_fee = "Registration fee cannot be negative";
    }

    // NEW: Image Validation
    if (imageFile) {
      // 1. Check Type
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
        newErrors.image =
          "Invalid file type. Please upload JPG, PNG, GIF, SVG, or WebP.";
      }
      // 2. Check Size
      else if (imageFile.size > MAX_IMAGE_SIZE) {
        newErrors.image = "Image size exceeds 5MB limit.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // Show the first error found
      toast.error(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };
  const { mutate: create, isPending: creating } = useCreateEvent({
    onSuccess: () => {
      toast.success("Event created successfully");
      onClose();
    },
    onError: () => toast.error("Failed to create event"),
  });

  const { mutate: update, isPending: updating } = useUpdateEvent(
    event?.id ?? 0,
    {
      onSuccess: () => {
        toast.success("Event updated successfully");
        onClose();
      },
      onError: () => toast.error("Failed to update event"),
    },
  );

  const isPending = creating || updating;

  const handleSubmit = () => {
    if (!validate()) return;
    const payload: EventPayload = {
      ...formData,
      description: formData.description || null,
      location: formData.location || null,
      end_date: formData.end_date || null,
      max_attendees: formData.max_attendees
        ? Number(formData.max_attendees)
        : null,
      registration_fee: formData.registration_fee
        ? Number(formData.registration_fee)
        : null,
      image: imageFile, // ✅ was formData.image || null
    };
    if (isEdit) update(payload);
    else create(payload);
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="flex flex-col w-full max-w-[620px] h-[85vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative my-4">
        <div className="flex flex-col gap-6  overflow-x-hidden p-2">
          {/* ── Header ── */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                {isEdit ? "Edit Event" : "Create New Event"}
              </p>
              <button
                onClick={onClose}
                disabled={isPending}
                className="text-gray-500 hover:text-black disabled:opacity-40"
              >
                ✕
              </button>
            </div>
            <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
              {isEdit
                ? "Update the event information below."
                : "Fill in the event details, schedule, and capacity information."}
            </p>
          </div>

          <div className="w-full border border-[#E5E7EB]" />

          {/* ── Section 1: Event Details ── */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Event Details
            </p>
            {/* Title */}
            <div>
              <FieldLabel label="Title" required />
              <input
                className={
                  errors.title ? inputClass + " border-red-400" : inputClass
                }
                placeholder="e.g. Annual General Meeting 2025"
                value={formData.title}
                onChange={(e) => setField("title", e.target.value)}
              />
              <FieldError message={errors.title} />
            </div>
            {/* Description */}
            <div>
              <FieldLabel label="Description" />
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="Brief description of the event..."
                value={formData.description ?? ""}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div>
              <FieldLabel label="Event Image" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImageFile(e.target.files?.[0] ?? null);
                  if (errors.image)
                    setErrors((prev) => ({ ...prev, image: "" })); // clear on new pick
                }}
                className={`w-full border rounded-[8px] px-[16px] py-[10px] bg-[#FFFFFF] text-[#6A7282] text-sm ${
                  errors.image ? "border-red-400" : "border-[#D1D5DC]"
                }`}
              />
              <FieldError message={errors.image} />{" "}
              {/* ← THIS is what displays the error */}
              {/* Preview new selection */}
              {imageFile && !errors.image && (
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB]"
                    alt="New upload preview"
                  />
                  <span className="text-[12px] text-[#6A7282]">
                    New image selected
                  </span>
                </div>
              )}
              {/* Show existing image on edit when no new file selected */}
              {!imageFile && event?.image && (
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={event.image}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB]"
                    alt="Current event image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="text-[12px] text-[#6A7282]">
                    Current image (unchanged)
                  </span>
                </div>
              )}
            </div>
            {/* Status */}
            <div>
              <FieldLabel label="Status" required />
              <CustomSelect
                value={formData.status}
                onChange={(val) => setField("status", val as EventStatus)}
                options={STATUS_OPTIONS}
                error={!!errors.status}
              />
              <FieldError message={errors.status} />
            </div>
            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* ── Section 2: Schedule & Location ── */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Schedule & Location
            </p>

            {/* Start Date + End Date */}
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="md:w-1/2">
                <FieldLabel label="Start Date" required />
                <input
                  type="datetime-local"
                  className={
                    errors.start_date
                      ? inputClass + " border-red-400"
                      : inputClass
                  }
                  value={formData.start_date}
                  onChange={(e) => setField("start_date", e.target.value)}
                />
                <FieldError message={errors.start_date} />
              </div>
              <div className="md:w-1/2">
                <FieldLabel label="End Date" />
                <input
                  type="datetime-local"
                  className={
                    errors.end_date
                      ? inputClass + " border-red-400"
                      : inputClass
                  }
                  value={formData.end_date ?? ""}
                  onChange={(e) => setField("end_date", e.target.value || null)}
                />
                <FieldError message={errors.end_date} />
              </div>
            </div>

            {/* Location */}
            <div>
              <FieldLabel label="Location" />
              <input
                className={inputClass}
                placeholder="e.g. Dhaka Convention Center"
                value={formData.location ?? ""}
                onChange={(e) => setField("location", e.target.value)}
              />
            </div>

            <div className="w-full border border-[#E5E7EB]" />
          </div>

          {/* ── Section 3: Capacity & Registration ── */}
          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
              Capacity & Registration
            </p>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="md:w-1/2">
                <FieldLabel label="Max Attendees" />
                <input
                  type="number"
                  min={1}
                  className={
                    errors.max_attendees
                      ? inputClass + " border-red-400"
                      : inputClass
                  }
                  placeholder="e.g. 200"
                  value={formData.max_attendees ?? ""}
                  onChange={(e) =>
                    setField(
                      "max_attendees",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
                <FieldError message={errors.max_attendees} />
              </div>
              <div className="md:w-1/2">
                <FieldLabel label="Registration Fee (৳)" />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={
                    errors.registration_fee
                      ? inputClass + " border-red-400"
                      : inputClass
                  }
                  placeholder="0.00 for free"
                  value={formData.registration_fee ?? ""}
                  onChange={(e) =>
                    setField(
                      "registration_fee",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                />
                <FieldError message={errors.registration_fee} />
                <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                  Leave blank or 0 for free events
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex ml-auto gap-[16px] w-fit">
              <button
                onClick={onClose}
                disabled={isPending}
                className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-60 gap-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isEdit ? (
                  <span>Save Changes</span>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Add Event</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
