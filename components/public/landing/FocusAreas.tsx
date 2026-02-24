'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BookOpen,
  Scale,
  Users,
  Leaf,
  Cpu,
  BadgeCheck,
  GraduationCap,
  HandCoins,
} from 'lucide-react';

const areas = [
  {
    title: 'Quality Education',
    description: 'Delivering quality education for community advancement and personal growth.',
    icon: BookOpen,
  },
  {
    title: 'Human Rights',
    description: 'Providing services for social improvement and protecting human rights of all.',
    icon: Scale,
  },
  {
    title: 'Women Empowerment',
    description: 'Ensuring active participation of women in society and economic activities.',
    icon: Users,
  },
  {
    title: 'Sustainable Development',
    description: 'Creating lasting positive change through sustainable development practices.',
    icon: Leaf,
  },
  {
    title: 'Technology Transfer',
    description: 'Introducing modern technologies to boost productivity and efficiency.',
    icon: Cpu,
  },
  {
    title: 'Good Governance',
    description: 'Establishing transparent and accountable governance in all operations.',
    icon: BadgeCheck,
  },
  {
    title: 'Capacity Building',
    description: 'Enhancing skills and capabilities through comprehensive training programs.',
    icon: GraduationCap,
  },
  {
    title: 'Poverty Reduction',
    description: 'Fighting poverty through microfinance and sustainable livelihood programs.',
    icon: HandCoins,
  },
];

gsap.registerPlugin(ScrollTrigger);

const FocusAreas = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('[data-focus-header]', {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '[data-focus-header]',
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from('[data-focus-card]', {
        opacity: 0,
        y: 24,
        scale: 0.98,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '[data-focus-grid]',
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 bg-[#0B2F1C] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(38,168,113,0.35),_rgba(11,47,28,0.15)_45%,_rgba(11,47,28,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(9,26,17,0.1)_0%,_rgba(9,26,17,0.7)_100%)]" />
      <div className="relative container mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
        <div data-focus-header className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0E4026] border border-white/10 px-4 py-1.5 text-sm font-medium text-[#DFF5E9] shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#36F293]" />
            Our Focus
          </div>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Foundation&apos;s Core Focus Areas
          </h2>
        </div>

        <div data-focus-grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <div
              key={area.title}
              data-focus-card
              className="rounded-2xl border border-white/10 bg-[#0E3A24]/90 backdrop-blur-sm px-6 py-7 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
            >
              <div className="h-11 w-11 rounded-lg bg-[#E6F6EE] text-[#0B2F1C] flex items-center justify-center mb-5">
                <area.icon size={22} strokeWidth={1.6} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{area.title}</h3>
              <p className="text-sm leading-relaxed text-[#CBE8D7]">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
