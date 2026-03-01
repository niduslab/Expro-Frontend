"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const packages = [
  {
    name: "Basic",
    price: "300",
    isPopular: false,
    features: [
      "Total Months 100",
      "Maturity Amount ৳50,000",
      "Status Closed",
      "Join Commission Closed",
    ],
  },
  {
    name: "Standard",
    price: "500",
    isPopular: true,
    features: [
      "Total Months 100",
      "Maturity Amount ৳85,000",
      "Status Closed",
      "Join Commission ৳500",
    ],
  },
  {
    name: "Advanced",
    price: "1000",
    isPopular: false,
    features: [
      "Total Months 100",
      "Maturity Amount ৳172,000",
      "Status Closed",
      "Join Commission ৳600",
    ],
  },
  {
    name: "Premium",
    price: "1500",
    isPopular: false,
    features: [
      "Total Months 100",
      "Maturity Amount ৳260,000",
      "Status Running",
      "Join Commission ৳700",
    ],
  },
];

const PensionPackages = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from("[data-packages-header]", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-packages-header]",
          start: "top 85%",
          once: true,
        },
      });

      // Cards Animation
      const cards = gsap.utils.toArray("[data-package-card]");
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: "[data-packages-grid]",
            start: "top 80%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#F2F4F7]">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        {/* Header */}
        <div data-packages-header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF3] px-3 py-1 rounded-md text-sm font-semibold text-[#027A48] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#027A48]"></span>
            Packages
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#101828] tracking-tight">
            Our Pension Packages
          </h2>
        </div>

        {/* Packages Grid */}
        <div
          data-packages-grid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center"
        >
          {packages.map((pkg, index) => {
            const isDark = pkg.isPopular;
            const cardBg = isDark ? "bg-[#003923]" : "bg-white";
            const borderColor = isDark
              ? "border-[#068847]"
              : "border-[#E4E7EC]";
            const titleColor = isDark ? "text-white" : "text-[#1D2939]";
            const priceColor = isDark ? "text-white" : "text-[#101828]";
            const monthColor = isDark ? "text-[#D0D5DD]" : "text-[#667085]";
            const buttonBg = isDark ? "bg-[#068847]" : "bg-white";
            const buttonText = isDark ? "text-white" : "text-[#344054]";
            const buttonBorder = isDark
              ? "border-[#12B76A]"
              : "border-[#D0D5DD]";
            const buttonHover = isDark
              ? "hover:bg-[#0E9F5C]"
              : "hover:bg-[#F9FAFB]";
            const featureTitleColor = isDark ? "text-white" : "text-[#1D2939]";
            const featureTextColor = isDark
              ? "text-[#EAECF0]"
              : "text-[#475467]";
            const checkColor = isDark ? "text-[#47CD89]" : "text-[#17B26A]";

            return (
              <div
                key={index}
                data-package-card
                className={`relative rounded-lg border ${cardBg} ${borderColor} w-77.5 min-h-113 p-6 flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute top-6 right-6 bg-[#36F293] text-[#003923] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Popular
                  </div>
                )}

                {/* Package Name */}
                <h3 className={`text-lg font-semibold mb-3 ${titleColor}`}>
                  {pkg.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className={`text-[48px] font-bold leading-none ${priceColor}`}
                  >
                    ৳{pkg.price}
                  </span>
                  <span className={`text-base font-normal ${monthColor}`}>
                    /month
                  </span>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold border ${buttonBg} ${buttonText} ${buttonBorder} ${buttonHover} transition-colors duration-200 mb-6`}
                >
                  Choose {pkg.name} Package
                </button>

                {/* Features List */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold mb-3 ${featureTitleColor}`}
                  >
                    Core Feature
                  </p>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className={`mt-0.5 shrink-0 ${checkColor}`}>
                          <Check size={16} strokeWidth={2.5} />
                        </div>
                        <span
                          className={`text-sm font-normal leading-relaxed ${featureTextColor}`}
                        >
                          {feature.split(/(৳[\d,]+)/).map((part, i) =>
                            part.match(/৳[\d,]+/) ? (
                              <span key={i} className="font-semibold">
                                {part}
                              </span>
                            ) : (
                              part
                            ),
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PensionPackages;
