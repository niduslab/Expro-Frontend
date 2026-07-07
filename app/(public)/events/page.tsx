"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react"; // Removed unused Calendar/Clock if handled by FormateDateTime
import { Button } from "@/components/ui/Button";
import { useEvents } from "@/lib/hooks/public/useEventHooks";
import FormateDateTime from "@/components/formateDateTime/page";
import Pagination from "@/components/pagination/page";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // 1. State for pagination
  const [page, setPage] = useState(1);
  const perPage = 10;

  // 2. Fetch Data
  // Ensure useEvents refetches when 'page' changes
  const { data, isLoading, error } = useEvents(page, perPage);

  // Filter published events
  const events = data?.data?.filter((e: any) => e.status === "published") || [];

  // Calculate total pages safely
  const totalItems = data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalItems / perPage);

  // 3. GSAP Animation (Unchanged)
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-events-header]", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-events-header]",
          start: "top 85%",
          once: true,
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>("[data-event-card]");
      cards.forEach((card, index) => {
        const isEven = index % 2 === 0;
        gsap.from(card, {
          opacity: 0,
          x: isEven ? -50 : 50,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [events]); // Add events as dependency so animations re-run when data changes!

  // 4. Pagination Handlers
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: Scroll to top
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: Scroll to top
    }
  };

  if (isLoading)
    return <div className="py-20 text-center">Loading events...</div>;
  if (error)
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load events.
      </div>
    );

  return (
    <section ref={sectionRef} className="font-dm-sans pt-32  bg-[#F2F4F7]">
      <div
        data-events-header
        className="flex flex-col items-center justify-between mb-12 gap-6"
      >
        <div className="max-w-2xl pt-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF3] px-3 py-1 rounded-md text-sm font-semibold text-[#027A48] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#027A48]"></span>
            Our Events
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#101828] leading-tight">
            Engagements That Strengthen Communities
          </h2>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 ">
        <div className="space-y-8">
          {events.length > 0 ? (
            events.map((event: any, index: number) => (
              <div
                key={event.id || index} // Use unique ID if available
                data-event-card
                className={`bg-white rounded-2xl p-6 md:p-8 flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 items-center shadow-sm hover:shadow-md transition-shadow duration-300`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2 h-75 lg:h-90 relative rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={
                      event.image || "/images/dashboard/memberApproval/1.jpg"
                    }
                    alt={event.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={event.image?.startsWith("http")}
                  />
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#101828] mb-4">
                    {event.title}
                  </h3>
                  <div
                    className="text-[#475467] text-base leading-relaxed mb-6 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: event.description ?? "",
                    }}
                  />

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#F2F4F7] px-3 py-1.5 rounded-full text-sm text-[#344054]">
                      <FormateDateTime
                        datetime={event.start_date}
                        type="date"
                        icon="calendar"
                      />
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#F2F4F7] px-3 py-1.5 rounded-full text-sm text-[#344054]">
                      <MapPin size={16} className="text-[#667085]" />
                      {event.location}
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#F2F4F7] px-3 py-1.5 rounded-full text-sm text-[#344054]">
                      <FormateDateTime
                        datetime={event.start_date}
                        type="time"
                        icon="clock"
                      />
                    </div>
                  </div>

                  {/* Button */}
                  <div>
                    <Link href={`/events/event-details/${event.id}`}>
                      {/* FIX: Ensure href is valid. event.title is usually not a valid URL path */}
                      <Button className="inline-block px-8 cursor-pointer py-3 bg-green-700 hover:bg-green-800 text-white text-[16px] font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No published events found.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center pb-2">
            <Pagination
              page={page}
              perPage={perPage}
              total={totalItems}
              dataLength={events.length}
              onNext={handleNext}
              onPrev={handlePrev}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
