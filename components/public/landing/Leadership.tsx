'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

const team = [
  {
    name: 'Md. Motahar Hossen',
    role: 'Founder & Chairman',
    emNo: '01',
    image: '/images/landing-page/our-leadership/125e98101d7746b2ef31b68b728baf6d5c697e82.png',
  },
  {
    name: 'Md. Hasan Shafiul Kabir',
    role: 'Vice Chairman',
    emNo: '02',
    image: '/images/landing-page/our-leadership/5145dbda138612bb2d5e7f49182b8cbc39f4fdf9.png',
  },
  {
    name: 'Md. Ahsanuzzaman',
    role: 'Secretary / Executive Director',
    emNo: '03',
    image: '/images/landing-page/our-leadership/8da3f7de3c0ee9f8ed0220c6156392ec089d31d8.png',
  },
  {
    name: 'Md. Yusuf Ali Khondokar',
    role: 'Treasurer',
    emNo: '04',
    image: '/images/landing-page/our-leadership/d28bf04d467e6b54b921af2ffb218941bd4c3f78.png',
  },
  {
    name: 'Md. Nur Islam',
    role: 'Executive Member',
    emNo: '05',
    image: '/images/landing-page/our-leadership/decbdde75be73f8ee519cf25ddefec10417179dc.png',
  },
  {
    name: 'Md. Motahar Hossen',
    role: 'Founder & Chairman',
    emNo: '06',
    image: '/images/landing-page/our-leadership/dfcc50a8f0f9b01836b48922b8d7028264313e2e.png',
  },
];

gsap.registerPlugin(ScrollTrigger);

const Leadership = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('[data-leadership-header]', {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '[data-leadership-header]',
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from('[data-leadership-card]', {
        opacity: 0,
        y: 28,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '[data-leadership-grid]',
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from('[data-leadership-button]', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '[data-leadership-button]',
          start: 'top 90%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <div data-leadership-header className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Our Team
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Meet Our Leadership
          </h2>
        </div>

        <div data-leadership-grid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-16">
          {team.map((member, index) => (
            <div
              key={index}
              data-leadership-card
              className="group relative w-full max-w-[421px] h-[500px] rounded-[8px] overflow-hidden border border-b-[1px] border-[#E5E7EB]"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>

              {/* Top Right Icon */}
              <div className="absolute top-4 right-4 z-10">
                <div className="w-8 h-8 rounded-full bg-[#008A4B] flex items-center justify-center text-white">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </div>

              {/* Bottom Content Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-[8px] p-5 shadow-sm">
                <h3 className="text-[20px] font-bold text-[#101828] mb-1">
                  {member.name}
                </h3>
                <p className="text-[#475467] text-sm font-normal mb-1">
                  {member.role}
                </p>
                <p className="text-[#475467] text-xs font-normal">
                  EM No: {member.emNo}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div data-leadership-button>
            <Link 
              href="/leadership" 
              className="inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              View All Members
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
