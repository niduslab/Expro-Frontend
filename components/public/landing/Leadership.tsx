'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const team = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    image: '/images/landing-page/our-leadership/125e98101d7746b2ef31b68b728baf6d5c697e82.png',
  },
  {
    name: 'Jane Smith',
    role: 'Chief Operating Officer',
    image: '/images/landing-page/our-leadership/5145dbda138612bb2d5e7f49182b8cbc39f4fdf9.png',
  },
  {
    name: 'Mike Johnson',
    role: 'Head of Technology',
    image: '/images/landing-page/our-leadership/8da3f7de3c0ee9f8ed0220c6156392ec089d31d8.png',
  },
  {
    name: 'Sarah Williams',
    role: 'Marketing Director',
    image: '/images/landing-page/our-leadership/d28bf04d467e6b54b921af2ffb218941bd4c3f78.png',
  },
  {
    name: 'Ava Thompson',
    role: 'Programs Director',
    image: '/images/landing-page/our-leadership/decbdde75be73f8ee519cf25ddefec10417179dc.png',
  },
  {
    name: 'David Lee',
    role: 'Finance Lead',
    image: '/images/landing-page/our-leadership/dfcc50a8f0f9b01836b48922b8d7028264313e2e.png',
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const Leadership = () => {
  return (
    <section className="py-20 bg-[#F8FAF9]">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E6EAE7] px-4 py-1.5 text-sm font-medium text-[#0B2F1C] shadow-[0_10px_25px_rgba(12,30,22,0.08)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#36F293]" />
            Our Leadership
          </div>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#0B2F1C]">
            The People Guiding Our Mission
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#55625B] max-w-3xl mx-auto">
            Dedicated leaders blending experience, compassion, and strategy to build sustainable impact.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {team.map((member) => (
            <motion.div
              key={`${member.name}-${member.role}`}
              variants={item}
              className="group rounded-2xl bg-white border border-[#E6EAE7] overflow-hidden shadow-[0_16px_40px_rgba(12,30,22,0.08)]"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2F1C]/55 via-transparent to-transparent" />
              </div>
              <div className="px-6 py-6 text-left">
                <h3 className="text-xl font-semibold text-[#0B2F1C]">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-[#1B7A4A]">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Leadership;
