import React from "react";

export interface Enterprise {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  light: string;
  accent: string;
  border: string;
  tag: string;
  image: string;
  icon: React.ReactNode;
}

export const enterprises: Enterprise[] = [
  {
    id: 1,
    title: "Expro Global Child Academy",
    subtitle: "Early Childhood & Global Education",
    description:
      "World-class early childhood education that builds critical thinking, creativity, and global awareness — empowering children to thrive in a connected world.",
    color: "from-sky-500 to-blue-600",
    light: "bg-sky-50",
    accent: "text-sky-700",
    border: "border-sky-200",
    tag: "bg-sky-100 text-sky-800",
    image: "/images/about/1. expro global child academi.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Expro Technical Training Institutes",
    subtitle: "Skills & Vocational Education",
    description:
      "Industry-aligned vocational training in engineering, construction, and skilled trades — bridging the gap between education and real-world employment.",
    color: "from-blue-600 to-indigo-700",
    light: "bg-blue-50",
    accent: "text-blue-700",
    border: "border-blue-200",
    tag: "bg-blue-100 text-blue-800",
    image: "/images/about/2. expro technical trainning.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Expro Organic Agro Science",
    subtitle: "Sustainable Agriculture",
    description:
      "Pioneering organic farming and agro-tech solutions that help farmers grow healthier crops — naturally, sustainably, and profitably.",
    color: "from-emerald-500 to-green-700",
    light: "bg-emerald-50",
    accent: "text-emerald-700",
    border: "border-emerald-200",
    tag: "bg-emerald-100 text-emerald-800",
    image: "/images/about/3. expro organic agro.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22V12" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        <path d="M8 5.2C8 3.4 9.8 2 12 2s4 1.4 4 3.2c0 2.4-4 6.8-4 6.8S8 7.6 8 5.2z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Expro Defensive Food & Beverage",
    subtitle: "Nutrition & Food Safety",
    description:
      "Fortified, health-protective food and beverage products designed to combat nutritional deficiencies and support long-term community wellbeing.",
    color: "from-orange-400 to-amber-600",
    light: "bg-orange-50",
    accent: "text-orange-700",
    border: "border-orange-200",
    tag: "bg-orange-100 text-orange-800",
    image: "/images/about/4. expro defensive food.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Expro Fashion Crafts",
    subtitle: "Textile & Creative Industry",
    description:
      "Connecting artisans and designers with global markets — blending cultural heritage with contemporary fashion for a sustainable creative economy.",
    color: "from-pink-500 to-rose-600",
    light: "bg-pink-50",
    accent: "text-pink-700",
    border: "border-pink-200",
    tag: "bg-pink-100 text-pink-800",
    image: "/images/about/5. expro fathion.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: "Expro Media & Publication",
    subtitle: "Content, Press & Digital Media",
    description:
      "A full-service media house publishing across print, digital, and broadcast — amplifying community stories and delivering content that informs and inspires.",
    color: "from-violet-500 to-purple-700",
    light: "bg-violet-50",
    accent: "text-violet-700",
    border: "border-violet-200",
    tag: "bg-violet-100 text-violet-800",
    image: "/images/about/6. expro media.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: 7,
    title: "Expro Digital Mart",
    subtitle: "E-Commerce & Digital Trade",
    description:
      "A digital marketplace connecting local producers and artisans to global consumers — backed by end-to-end logistics, e-commerce tools, and digital literacy support.",
    color: "from-cyan-500 to-teal-600",
    light: "bg-cyan-50",
    accent: "text-cyan-700",
    border: "border-cyan-200",
    tag: "bg-cyan-100 text-cyan-800",
    image: "/images/about/7. expro Digital mart.png",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
];