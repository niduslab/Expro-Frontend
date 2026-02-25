'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Counter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const obj = { value: 0 };
      gsap.to(obj, {
        value,
        duration: 1.6,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          if (!ref.current) {
            return;
          }
          const formatted = Math.floor(obj.value);
          ref.current.textContent = `${formatted < 10 ? `0${formatted}` : formatted}${suffix}`;
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [value, suffix]);

  return <span ref={ref} className="text-4xl font-bold text-gray-900">00{suffix}</span>;
};

const WhoWeAre = () => {
  // Text segments for the animated paragraph
  const textSegments = [
    { text: "Expro Welfare Foundation", className: "font-playfair-display italic text-[#008A4B] font-bold" },
    { text: " is a welfare-focused organization committed to empowering communities through sustainable initiatives, transparent governance, and long-term financial security programs. Our mission is to support individuals with structured welfare services and ", className: "font-dm-sans text-gray-900" },
    { text: "pension solutions that promote stability, dignity, and shared progress.", className: "font-playfair-display italic text-[#667085]" }
  ];

  // Flatten words for range calculation
  const words: { text: string, className: string }[] = [];
  textSegments.forEach(seg => {
    seg.text.split(' ').forEach(word => {
      if(word) words.push({ text: word, className: seg.className });
    })
  });
  
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('[data-who-badge]', {
        opacity: 0,
        y: 30,
        scale: 0.95,
        filter: 'blur(10px)',
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '[data-who-badge]',
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from('[data-who-button]', {
        opacity: 0,
        y: 30,
        scale: 0.95,
        filter: 'blur(10px)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '[data-who-button]',
          start: 'top 85%',
          once: true,
        },
      });

      const wordElements = gsap.utils.toArray<HTMLElement>('[data-who-word]');
      if (wordElements.length) {
        // Initial state: muted, grayed out, slightly offset
        gsap.set(wordElements, { 
          opacity: 0.2, 
          filter: 'grayscale(100%)', 
          y: 20,
          willChange: 'opacity, transform, filter' 
        });

        // Animate to full visibility and vibrant color
        gsap.to(wordElements, {
          opacity: 1,
          filter: 'grayscale(0%)',
          y: 0,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '[data-who-paragraph]',
            start: 'top 85%',
            end: 'bottom 45%',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        });
      }

      gsap.from('[data-who-stat]', {
        opacity: 0,
        y: 30,
        scale: 0.98,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '[data-who-stats]',
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="mx-auto">
          {/* Badge */}
          <div data-who-badge className="mb-6">
            <span className="inline-flex items-center gap-2 bg-[#ECFDF3] text-[#027A48] px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#027A48]"></span>
              Who We Are?
            </span>
          </div>

          {/* Main Content - Word by Word Reveal */}
          <div className="mb-10">
            <p
              data-who-paragraph
              className="text-[40px] leading-[1.2] tracking-[-0.4px] flex flex-wrap"
            >
              {words.map((wordObj, i) => {
                return (
                  <span
                    key={i}
                    data-who-word
                    className={`${wordObj.className} inline-block mr-[0.25em]`}
                  >
                    {wordObj.text}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Button */}
          <div data-who-button className="mb-16">
            <Link href="/about">
              <Button className="inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md">
                More About Us
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div data-who-stats className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div data-who-stat className="bg-[#F0F4F2] w-[310px] h-[195px] p-8 rounded-[8px] border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
              <h3 className="text-gray-600 text-base mb-4 font-medium">Years Of Experience</h3>
              <Counter value={8} suffix=" +" />
            </div>
            
            {/* Card 2 */}
            <div data-who-stat className="bg-[#F0F4F2] w-[310px] h-[195px] p-8 rounded-[8px] border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
              <h3 className="text-gray-600 text-base mb-4 font-medium">Active Users</h3>
              <Counter value={2000} suffix=" +" />
            </div>

            {/* Card 3 */}
            <div data-who-stat className="bg-[#F0F4F2] w-[310px] h-[195px] p-8 rounded-[8px] border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
              <h3 className="text-gray-600 text-base mb-4 font-medium">Customer Satisfaction</h3>
              <Counter value={100} suffix=" %" />
            </div>

            {/* Card 4 */}
            <div data-who-stat className="bg-[#F0F4F2] w-[310px] h-[195px] p-8 rounded-[8px] border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
              <h3 className="text-gray-600 text-base mb-4 font-medium">Projects Are Done</h3>
              <Counter value={50} suffix=" +" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
