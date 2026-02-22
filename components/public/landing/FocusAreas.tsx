'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
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

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const FocusAreas = () => {
  return (
    <section className="relative py-20 bg-[#0B2F1C] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(38,168,113,0.35),_rgba(11,47,28,0.15)_45%,_rgba(11,47,28,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(9,26,17,0.1)_0%,_rgba(9,26,17,0.7)_100%)]" />
      <div className="relative container mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0E4026] border border-white/10 px-4 py-1.5 text-sm font-medium text-[#DFF5E9] shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#36F293]" />
            Our Focus
          </div>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Foundation&apos;s Core Focus Areas
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {areas.map((area) => (
            <motion.div
              key={area.title}
              variants={item}
              className="rounded-2xl border border-white/10 bg-[#0E3A24]/90 backdrop-blur-sm px-6 py-7 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
            >
              <div className="h-11 w-11 rounded-lg bg-[#E6F6EE] text-[#0B2F1C] flex items-center justify-center mb-5">
                <area.icon size={22} strokeWidth={1.6} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{area.title}</h3>
              <p className="text-sm leading-relaxed text-[#CBE8D7]">{area.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FocusAreas;
