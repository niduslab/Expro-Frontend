// page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Hero from "../hero";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  PhoneCall,
} from "lucide-react";
import { useEvent, useEvents } from "@/lib/hooks/public/useEventHooks";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function EventDetails() {
  const params = useParams();
  const id = Number(params?.id);

  const { data: event, isLoading, isError } = useEvent(id);
  const { data: eventsData } = useEvents(1, 4);

  // Parse metadata safely
  let metadata: { organizer_contact?: string; requirements?: string[] } = {};
  try {
    if (event?.metadata) metadata = JSON.parse(event.metadata);
  } catch {}

  const upcomingEvents =
    eventsData?.data.filter((e) => e.id !== id).slice(0, 3) ?? [];

  return (
    <>
      <Hero />

      <div className="font-dm-sans flex flex-col items-center bg-gray-50">
        <main className="w-full max-w-7xl px-6 py-16 flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="flex-1 flex flex-col gap-8 bg-white p-8 rounded-lg shadow-md">
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="animate-pulse space-y-6">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-8 bg-gray-200 rounded w-2/3" />
                <div className="w-full h-96 bg-gray-200 rounded-md" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                  <div className="h-4 bg-gray-100 rounded w-4/6" />
                </div>
              </div>
            )}

            {/* Error */}
            {isError && (
              <p className="text-red-500 text-center py-10">
                Failed to load event details. Please try again.
              </p>
            )}

            {/* Event Data */}
            {event && (
              <>
                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-[#008A4B]" />
                    {formatDate(event.start_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-[#008A4B]" />
                    {event.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#ECFDF3] text-[#027A48] text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
                    {event.status}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                  {event.title}
                </h1>

                {/* Banner Image */}
                {event.image && (
                  <div className="relative w-full h-96 rounded-md overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      unoptimized={event.image.startsWith("http")}
                    />
                  </div>
                )}

                {/* Description */}

                <div
                  className="text-gray-700 leading-relaxed text-base"
                  dangerouslySetInnerHTML={{
                    __html: event.description ?? "",
                  }}
                />

                <div className="h-px bg-gray-100" />

                {/* Event Info Grid */}
                <section className="flex flex-col gap-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Event Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100 flex items-start gap-3">
                      <Calendar
                        size={18}
                        className="text-[#008A4B] mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                          Start Date
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatDate(event.start_date)} at{" "}
                          {formatTime(event.start_date)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100 flex items-start gap-3">
                      <Clock
                        size={18}
                        className="text-[#008A4B] mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                          End Date
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatDate(event.end_date)} at{" "}
                          {formatTime(event.end_date)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100 flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="text-[#008A4B] mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                          Location
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {event.location}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100 flex items-start gap-3">
                      <Users
                        size={18}
                        className="text-[#008A4B] mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                          Max Attendees
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {event.max_attendees}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100 flex items-start gap-3">
                      <DollarSign
                        size={18}
                        className="text-[#008A4B] mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                          Registration Fee
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {parseFloat(event.registration_fee) === 0
                            ? "Free"
                            : `৳ ${parseFloat(event.registration_fee).toLocaleString()}`}
                        </p>
                      </div>
                    </div>

                    {metadata.organizer_contact && (
                      <div className="bg-[#F9FAFB] rounded-xl px-5 py-4 border border-gray-100 flex items-start gap-3">
                        <PhoneCall
                          size={18}
                          className="text-[#008A4B] mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                            Organizer Contact
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {metadata.organizer_contact}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Requirements */}
                {metadata.requirements && metadata.requirements.length > 0 && (
                  <section className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Requirements
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-800 text-base">
                      {metadata.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Created By */}
                <p className="text-xs text-gray-400">
                  Posted by: {event.created_by}
                </p>
              </>
            )}
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-semibold text-gray-900">
              Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
              <p className="text-gray-400 text-sm">No upcoming events.</p>
            ) : (
              upcomingEvents.map((ev) => (
                <Link
                  key={ev.id}
                  href={`/events/event-details/${ev.id}`}
                  className="flex gap-4 items-start border-b border-gray-200 pb-4 last:border-b-0 hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-28 h-28 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={ev.image || "/fallback.jpg"}
                      alt={ev.title}
                      fill
                      className="object-cover"
                      unoptimized={ev.image?.startsWith("http")}
                    />
                  </div>
                  <div className="flex flex-col gap-1 pt-2">
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(ev.start_date)}
                    </p>
                    <p className="font-semibold text-gray-900 text-sm leading-snug">
                      {ev.title}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin size={12} />
                      {ev.location}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </aside>
        </main>
      </div>
    </>
  );
}
