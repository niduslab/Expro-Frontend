'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Heart, 
  GraduationCap, 
  Sprout, 
  Users, 
  HandHeart, 
  Tv, 
  ArrowUpRight 
} from 'lucide-react';

const services = [
  {
    title: 'Health Programs',
    description: 'Providing accessible healthcare services, medical camps, and health awareness programs to underserved communities.',
    image: '/images/landing-page/what-we-do/17b349fa401e7df876b2e86aa904075458e5a936.jpg',
    icon: Heart,
    link: '#',
  },
  {
    title: 'Education Support',
    description: 'Empowering through knowledge with scholarships, schools, and educational resources for children and adults.',
    image: '/images/landing-page/what-we-do/3cbfda320dd7781e80fffe9dac1be01f5699a106.jpg',
    icon: GraduationCap,
    link: '#',
  },
  {
    title: 'Agriculture Development',
    description: 'Supporting sustainable farming practices, providing resources and training for rural farmers.',
    image: '/images/landing-page/what-we-do/a4385f1e3bcee3ee1243d95f6f7be44aaff692d7.jpg',
    icon: Sprout,
    link: '#',
  },
  {
    title: 'Women Entrepreneurship',
    description: 'Providing accessible healthcare services, medical camps, and health awareness programs to underserved communities.',
    image: '/images/landing-page/what-we-do/c20153c681270ed346be602a6c69559deb80cd8d.jpg',
    icon: Users,
    link: '#',
  },
  {
    title: 'Humanity Initiatives',
    description: 'Disaster relief, humanitarian aid, and support for families in crisis situations.',
    image: '/images/landing-page/what-we-do/0e90e9e34e7a5e331dfff3d6c7a8c62f74d206c7.jpg',
    icon: HandHeart,
    link: '#',
  },
  {
    title: 'Media & Awareness',
    description: 'Spreading awareness, sharing stories of impact, and promoting transparency through media initiatives.',
    image: '/images/landing-page/what-we-do/f6c746f7a4e082fda48cd73ea70537c916c0cd3c.jpg',
    icon: Tv,
    link: '#',
  },
];

gsap.registerPlugin(ScrollTrigger);

const WhatWeDo = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const badge = sectionRef.current?.querySelector('[data-whatwedo-badge]');
      const title = sectionRef.current?.querySelector('[data-whatwedo-title]');
      const grid = sectionRef.current?.querySelector('[data-whatwedo-grid]');
      const button = sectionRef.current?.querySelector('[data-whatwedo-button]');
      const cards = sectionRef.current?.querySelectorAll('[data-whatwedo-card]');

      if (badge) {
        gsap.fromTo(badge, 
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: badge,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      if (title) {
        gsap.fromTo(title, 
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      if (cards && cards.length > 0) {
        gsap.fromTo(cards, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: grid || sectionRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      if (button) {
        gsap.fromTo(button, 
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: button,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <div className="text-center mb-16">
          <div
            data-whatwedo-badge
            className="inline-block px-4 py-1.5 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-6"
          >
            Our Projects
          </div>
          <h2 data-whatwedo-title className="text-3xl md:text-5xl font-bold text-gray-900">
            Our Impact Areas – “What We Do”
          </h2>
        </div>
        
        <div data-whatwedo-grid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              data-whatwedo-card
              className="bg-white rounded-[8px] p-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-[538px] w-full max-w-[421px] mx-auto group"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <service.icon size={24} strokeWidth={1.5} />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-green-700 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed line-clamp-4">
                {service.description}
              </p>
              
              <Link 
                href={service.link} 
                className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 mb-8 transition-colors group/link"
              >
                Learn More 
                <ArrowUpRight size={16} className="ml-1 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
              
              <div className="relative h-[192px] w-full rounded-[4px] overflow-hidden mt-auto shrink-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div data-whatwedo-button>
            <Link 
              href="/projects" 
              className="inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
