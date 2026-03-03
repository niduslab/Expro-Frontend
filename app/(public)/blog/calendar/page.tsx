"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import DemoNoticeTicker from "@/components/dev-warning/page";

type Event = {
  id: string;
  title: string;
  date: string; // ISO string
  description: string;
  link?: string;
};

// Sample events
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Community Workshop",
    date: "2026-03-10",
    description: "Workshop on pension planning and community engagement.",
    link: "#",
  },
  {
    id: "2",
    title: "Webinar: Digital Transformation",
    date: "2026-03-18",
    description: "Learn about our digital transformation journey and tools.",
    link: "#",
  },
  {
    id: "3",
    title: "Annual Fundraiser",
    date: "2026-03-25",
    description: "Join us to support community development projects.",
    link: "#",
  },
];

// Manually implement eachDayOfInterval
const getDaysInMonth = (start: Date, end: Date): Date[] => {
  const days: Date[] = [];
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const days: Date[] = getDaysInMonth(monthStart, monthEnd);

  const getEventsForDate = (date: Date): Event[] =>
    sampleEvents.filter((event) => isSameDay(new Date(event.date), date));

  return (
    <section className="text-black min-h-screen pt-32 pb-24 px-6">
      <DemoNoticeTicker />
      {/* Header */}

      <div className="text-center mb-6 flex flex-col items-center gap-5">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
          Calendar & Events
        </h2>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
          Calendar & Events
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-6 text-gray-600">This Month</h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold text-gray-800">
              {day}
            </div>
          ))}

          {days.map((day: Date) => {
            const dayEvents = getEventsForDate(day);
            return (
              <div
                key={day.toISOString()}
                className={`p-3 border border-gray-300 text-gray-800 rounded-lg cursor-pointer hover:bg-green-50 ${
                  isSameDay(day, today) ? "bg-[#027A48] font-bold" : ""
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <span>{format(day, "d")}</span>
                {dayEvents.length > 0 && (
                  <div className="mt-1 text-xs text-white bg-[#027A48] rounded-full w-5 h-5 mx-auto flex items-center justify-center">
                    {dayEvents.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">
              Events on {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="mb-3 border border-gray-200 rounded-2xl p-4 pb-2"
                >
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  <p className="text-gray-600">{event.description}</p>
                  {event.link && (
                    <a
                      href={event.link}
                      className="text-green-600 hover:underline text-sm"
                    >
                      More info
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No events for this day.</p>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Events Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          Upcoming Events
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {sampleEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  {format(new Date(event.date), "MMMM d, yyyy")}
                </p>
                <p className="text-gray-600 mt-2">{event.description}</p>
                {event.link && (
                  <a
                    href={event.link}
                    className="mt-4 flex items-center  text-green-600 font-semibold hover:underline"
                  >
                    More info <ArrowUpRight />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CalendarPage;
