"use client";

import { useRouter } from "next/navigation";
import Hero from "./hero";
import Image from "next/image";

export default function EventDetails() {
  const router = useRouter();
  return (
    <>
      <Hero />
      <div className="font-dm-sans flex flex-col items-center bg-gray-50">
        <main className="w-full max-w-7xl px-6 py-16 flex flex-col lg:flex-row gap-12">
          {/* Event Content */}
          <article className="flex-1 flex flex-col gap-8 bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-500 text-sm">
              Event Date: April 18, 2026 | Location: Community Hall, Lagos
            </p>

            <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
              Green Earth Initiative
            </h1>

            <div className="relative w-full h-96 rounded-md overflow-hidden duration-500 hover:scale-102 hover:transition-transform hover:duration-500">
              <Image
                src="/images/events/event-poster.png"
                alt="Event banner"
                fill
                className="object-cover"
              />
            </div>

            <p className="text-gray-700 leading-relaxed text-base">
              Join our massive tree plantation drive. Goal: Plant 10,000 trees
              to combat climate change and restore natural habitats.
            </p>

            {/* Section: About the Event */}
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                About the Event
              </h2>

              <p className="text-gray-700 leading-relaxed text-base">
                This summit is designed to provide practical insights, hands-on
                workshops, and mentorship sessions that equip participants with
                real-world skills. Industry experts and community leaders will
                share strategies for economic stability, leadership development,
                and innovation.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4">
                Event Highlights:
              </h3>

              <ul className="list-disc list-inside space-y-2 text-gray-800 text-base">
                <li>Interactive skill development workshops</li>
                <li>Panel discussions with industry leaders</li>
                <li>Financial literacy and pension awareness sessions</li>
                <li>Networking and mentorship opportunities</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">
                Who Should Attend?
              </h3>

              <ul className="list-disc list-inside space-y-2 text-gray-800 text-base">
                <li>Young professionals and students</li>
                <li>Aspiring entrepreneurs</li>
                <li>Community development advocates</li>
                <li>Small business owners</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">
                Expected Outcomes
              </h3>

              <p className="text-gray-700 leading-relaxed text-base">
                Participants will gain actionable knowledge, expand their
                professional networks, and leave with clear strategies to
                improve their personal and financial growth. The event also
                strengthens collaboration among community members and
                organizations working toward sustainable development.
              </p>
            </section>
          </article>

          {/* Sidebar: Upcoming Events */}
          <aside className="w-full lg:w-80 flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900">
              Upcoming Events
            </h2>

            {[
              {
                title: "Disaster Relief Training",
                date: "06 February, 2026",

                image:
                  "/images/landing-page/events/45cfcb47c1850f33fb81de1fcbb9c346e53f1581.jpg", // Placeholder, using second available
              },
              {
                title: "Women Business Workshop",
                date: "06 February, 2026",

                image:
                  "/images/landing-page/events/9d28340008ab0f8b020c34003fa1a49fdbe7cda1.jpg",
                link: "events/event-details",
              },
            ].map((event, idx) => (
              <div
                key={idx}
                onClick={() => {
                  router.push("#");
                }}
                className="flex gap-4 items-start border-b border-gray-200 pb-4 last:border-b-0 cursor-pointer"
              >
                <div className="relative w-28 h-28 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <p className="text-gray-500 text-sm">{event.date}</p>
                  <p className="font-semibold text-gray-900 text-base">
                    {event.title}
                  </p>
                </div>
              </div>
            ))}
          </aside>
        </main>
      </div>
    </>
  );
}
