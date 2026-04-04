"use client";

import { Event } from "@/lib/types/admin/eventType";
import { Pencil } from "lucide-react";

interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit: (event: Event) => void;
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

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> =
  {
    draft: { bg: "#F3F4F6", text: "#6B7280", dot: "●" },
    published: { bg: "#DCFCE7", text: "#16A34A", dot: "●" },
    cancelled: { bg: "#FEE2E2", text: "#DC2626", dot: "●" },
    completed: { bg: "#DBEAFE", text: "#2563EB", dot: "●" },
  };

export default function EventDetailModal({
  open,
  onClose,
  event,
  onEdit,
}: EventDetailModalProps) {
  if (!open || !event) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusStyle = STATUS_STYLES[event.status] ?? STATUS_STYLES.draft;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex flex-col w-full max-w-[620px] h-[85vh] bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black overflow-hidden">
        {/* ── Fixed Header ── */}
        <div className="flex-shrink-0 flex flex-col gap-2 px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
              Event Details
            </p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
            Full information for this event.
          </p>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Section 1: Event Overview */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                  Event Overview
                </p>
                <span
                  className="inline-flex items-center px-[10px] py-[4px] rounded-full font-semibold text-[12px] leading-[150%] capitalize gap-1"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.text,
                  }}
                >
                  {statusStyle.dot} {event.status}
                </span>
              </div>

              <DetailField label="Title" value={event.title} />

              {event.description && (
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[12px] leading-[150%] tracking-[-0.01em] text-[#6A7282] uppercase">
                    Description
                  </span>
                  <p className="font-normal text-[14px] leading-[160%] tracking-[-0.01em] text-[#030712] whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              )}

              {event.project_id && (
                <DetailField
                  label="Project ID"
                  value={String(event.project_id)}
                />
              )}

              <SectionDivider />
            </div>

            {/* Section 2: Schedule & Location */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Schedule & Location
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Start Date"
                    value={formatDate(event.start_date)}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="End Date"
                    value={formatDate(event.end_date)}
                  />
                </div>
              </div>

              <DetailField label="Location" value={event.location} />

              <SectionDivider />
            </div>

            {/* Section 3: Capacity & Fees */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Capacity & Registration
              </p>

              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Max Attendees"
                    value={
                      event.max_attendees != null
                        ? String(event.max_attendees)
                        : null
                    }
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Registration Fee"
                    value={
                      event.registration_fee != null
                        ? `৳ ${Number(event.registration_fee).toFixed(2)}`
                        : "Free"
                    }
                  />
                </div>
              </div>

              <SectionDivider />
            </div>

            {/* Section 4: Record Info */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]">
                Record Info
              </p>
              <div className="w-1/2">
                <DetailField label="Created by" value={event.created_by} />
              </div>
              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <DetailField
                    label="Created At"
                    value={formatDate(event.created_at)}
                  />
                </div>
                <div className="w-1/2">
                  <DetailField
                    label="Last Updated"
                    value={formatDate(event.updated_at)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Fixed Footer ── */}
        <div className="flex-shrink-0 flex items-center gap-[16px] px-6 py-4 border-t border-[#E5E7EB] bg-white">
          <button
            onClick={onClose}
            className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em]"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(event)}
            className="bg-[#068847] h-[48px] w-[180px] rounded-xl px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] gap-2"
          >
            <Pencil className="h-4 w-4" />
            <span>Edit Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}
