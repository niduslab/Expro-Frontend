import React from 'react';
import Hero from '@/components/public/landing/Hero';
import WhoWeAre from '@/components/public/landing/WhoWeAre';
import WhatWeDo from '@/components/public/landing/WhatWeDo';
import Leadership from '@/components/public/landing/Leadership';
import FocusAreas from '@/components/public/landing/FocusAreas';
import Events from '@/components/public/landing/Events';
import PensionPackages from '@/components/public/landing/PensionPackages';
import NewsArticles from '@/components/public/landing/NewsArticles';
import Gallery from '@/components/public/landing/Gallery';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <WhatWeDo />
      <FocusAreas />
      <Leadership />
      <Events />
      <PensionPackages />
      <NewsArticles />
      <Gallery />
    </>
  );
}
