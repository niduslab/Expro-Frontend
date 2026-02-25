'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const events = [
  {
    title: 'Green Earth Initiative',
    description: 'Join our massive tree plantation drive. Goal: Plant 10,000 trees to combat climate change and restore natural habitats.',
    date: '06 February, 2026',
    location: 'Gulshan-1, Dhaka',
    time: '11.30 AM - 2.30 PM',
    image: '/images/landing-page/events/4054bc10557d09dffea4f8c04b8bc54930895f16.jpg', // Placeholder, using first available
    link: '#',
  },
  {
    title: 'Disaster Relief Training',
    description: 'Training volunteers for emergency response and disaster relief operations. Learn essential skills to help communities during crises.',
    date: '06 February, 2026',
    location: 'National Training Center',
    time: '11.30 AM - 2.30 PM',
    image: '/images/landing-page/events/45cfcb47c1850f33fb81de1fcbb9c346e53f1581.jpg', // Placeholder, using second available
    link: '#',
  },
  {
    title: 'Women Business Workshop',
    description: 'Empowering women entrepreneurs with business skills, financial literacy, and networking opportunities to build sustainable livelihoods.',
    date: '06 February, 2026',
    location: 'Community Center, Chittagong',
    time: '11.30 AM - 2.30 PM',
    image: '/images/landing-page/events/9d28340008ab0f8b020c34003fa1a49fdbe7cda1.jpg',
    link: '#',
  },
];

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from('[data-events-header]', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '[data-events-header]',
          start: 'top 85%',
          once: true,
        },
      });

      // Cards Animation
      const cards = gsap.utils.toArray<HTMLElement>('[data-event-card]');
      cards.forEach((card, index) => {
        const isEven = index % 2 === 0;
        gsap.from(card, {
          opacity: 0,
          x: isEven ? -50 : 50, // Slide from left for even, right for odd (or simple fade up)
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#F2F4F7]">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        {/* Header */}
        <div data-events-header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#ECFDF3] px-3 py-1 rounded-md text-sm font-semibold text-[#027A48] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#027A48]"></span>
              Our Events
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#101828] leading-tight">
              Engagements That Strengthen Communities
            </h2>
          </div>
          <div className="shrink-0">
            <Link href="/events">
              <Button className="inline-block px-8 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md">
                
                View All Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-8">
          {events.map((event, index) => (
            <div
              key={index}
              data-event-card
              className={`bg-white rounded-2xl p-6 md:p-8 flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 h-75 lg:h-90 relative rounded-xl overflow-hidden shrink-0">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold text-[#101828] mb-4">
                  {event.title}
                </h3>
                <p className="text-[#475467] text-base leading-relaxed mb-6">
                  {event.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="inline-flex items-center gap-2 bg-[#F2F4F7] px-3 py-1.5 rounded-full text-sm text-[#344054]">
                    <Calendar size={16} className="text-[#667085]" />
                    {event.date}
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[#F2F4F7] px-3 py-1.5 rounded-full text-sm text-[#344054]">
                    <MapPin size={16} className="text-[#667085]" />
                    {event.location}
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[#F2F4F7] px-3 py-1.5 rounded-full text-sm text-[#344054]">
                    <Clock size={16} className="text-[#667085]" />
                    {event.time}
                  </div>
                </div>

                {/* Button */}
                <div>
                  <Link href={event.link}>
                    <Button className="inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white text-[16px] font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
