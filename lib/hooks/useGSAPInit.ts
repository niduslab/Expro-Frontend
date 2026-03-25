import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Hook: Initialize GSAP
 * Registers GSAP plugins and sets up global configuration
 * 
 * @example
 * function App() {
 *   useGSAPInit();
 *   return <div>...</div>;
 * }
 */
export const useGSAPInit = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Global GSAP configuration
    gsap.config({
      nullTargetWarn: false,
      trialWarn: false,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};
