'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion, Variants, useScroll, useTransform, MotionValue, useSpring, useInView } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 1.5, 
      ease: [0.22, 0.61, 0.36, 1] 
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.35,
      delayChildren: 0.2
    }
  }
};

const Word = ({ children, range, progress, className }: { children: string, range: [number, number], progress: MotionValue<number>, className: string }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <motion.span style={{ opacity }} className={`${className} inline-block mr-[0.25em]`}>
      {children}
    </motion.span>
  );
}

const Counter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, {
    damping: 60,
    stiffness: 45,
    restDelta: 0.001
  });

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, value, springValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        // Format number with leading zero if less than 10, otherwise normal
        const formatted = Math.floor(latest);
        ref.current.textContent = (formatted < 10 ? `0${formatted}` : `${formatted}`) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref} className="text-4xl font-bold text-gray-900">00{suffix}</span>;
};

const WhoWeAre = () => {
  // Text segments for the animated paragraph
  const textSegments = [
    { text: "Expro Welfare Foundation", className: "italic text-[#008A4B] font-bold" },
    { text: " is a welfare-focused organization committed to empowering communities through sustainable initiatives, transparent governance, and long-term financial security programs. Our mission is to support individuals with structured welfare services and ", className: "text-gray-900" },
    { text: "pension solutions that promote stability, dignity, and shared progress.", className: "italic text-[#667085]" }
  ];

  // Flatten words for range calculation
  const words: { text: string, className: string }[] = [];
  textSegments.forEach(seg => {
    seg.text.split(' ').forEach(word => {
      if(word) words.push({ text: word, className: seg.className });
    })
  });
  
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ['start 0.95', 'start 0.15']
  });
  
  // Add spring smoothing to the scroll progress for GSAP-like feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 45,
    restDelta: 0.001
  });

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="mx-auto">
          {/* Badge */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp} 
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-[#ECFDF3] text-[#027A48] px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#027A48]"></span>
              Who We Are?
            </span>
          </motion.div>

          {/* Main Content - Word by Word Reveal */}
          <div className="mb-10">
            <p ref={element} className="font-playfair-display text-[40px] leading-[1.2] tracking-[-0.4px] flex flex-wrap">
              {words.map((wordObj, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                return (
                  <Word 
                    key={i} 
                    range={[start, end]} 
                    progress={smoothProgress} 
                    className={wordObj.className}
                  >
                    {wordObj.text}
                  </Word>
                );
              })}
            </p>
          </div>

          {/* Button */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <Link href="/about">
              <Button className="bg-green-700 hover:bg-green-900 text-white px-8 py-6 text-base font-medium rounded-lg">
                More About Us
              </Button>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Card 1 */}
            <motion.div variants={fadeInUp} className="bg-[#E5E7EB] w-[310px] h-[195px] p-8 rounded-[8px] border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
              <h3 className="text-gray-600 text-base mb-4 font-medium">Years Of Experience</h3>
              <Counter value={8} suffix=" +" />
            </motion.div>
            
            {/* Card 2 */}
            <motion.div variants={fadeInUp} className="bg-[#E5E7EB] w-[310px] h-[195px] p-8 rounded-[8px] border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
              <h3 className="text-gray-600 text-base mb-4 font-medium">Active Users</h3>
              <Counter value={2000} suffix=" +" />
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp} className="bg-[#E5E7EB] w-[310px] h-[195px] p-8 rounded-[8px] border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
              <h3 className="text-gray-600 text-base mb-4 font-medium">Customer Satisfaction</h3>
              <Counter value={100} suffix=" %" />
            </motion.div>

            {/* Card 4 */}
            <motion.div variants={fadeInUp} className="bg-[#E5E7EB] w-[310px] h-[195px] p-8 rounded-[8px] border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col justify-center">
              <h3 className="text-gray-600 text-base mb-4 font-medium">Projects Are Done</h3>
              <Counter value={50} suffix=" +" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
