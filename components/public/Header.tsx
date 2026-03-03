"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import gsap from "gsap";
import {
  GoogleTranslateScript,
  GoogleTranslateButton,
} from "../ui/GoogleTranslator";

interface NavLink {
  name: string;
  href: string;
  hasDropdown: boolean;
  megaMenu?: {
    title: string;
    items: { name: string; href: string }[];
  }[];
  dropdownItems?: { name: string; href: string }[];
}

const DesktopNavItem = ({ link }: { link: NavLink }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasAnyDropdown = link.megaMenu || link.dropdownItems;

  useEffect(() => {
    if (hasAnyDropdown && dropdownRef.current) {
      // Set initial state for animation: Hidden, slightly shifted down, scaled down
      gsap.set(dropdownRef.current, {
        autoAlpha: 0,
        y: 10,
        scaleY: 0.95,
        transformOrigin: "top center",
        display: "block",
      });
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hasAnyDropdown]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
    if (hasAnyDropdown && dropdownRef.current) {
      gsap.to(dropdownRef.current, {
        autoAlpha: 1,
        y: 0,
        scaleY: 1,
        duration: 0.3,
        ease: "power3.out",
        overwrite: true,
      });
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      if (hasAnyDropdown && dropdownRef.current) {
        gsap.to(dropdownRef.current, {
          autoAlpha: 0,
          y: 10,
          scaleY: 0.95,
          duration: 0.2,
          ease: "power2.in",
          overwrite: true,
        });
      }
    }, 150); // 150ms delay to prevent flickering
  };

  return (
    <div
      className="relative flex items-center gap-1 cursor-pointer h-full py-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={link.href}
        className={`relative font-normal not-italic text-[16px] leading-[150%] tracking-[-0.16px] transition-colors duration-200 flex items-center gap-1 ${
          isHovered ? "text-[#068847]" : "text-gray-800"
        }`}
      >
        {link.name}
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-[#068847] transition-all duration-300 ${
            isHovered ? "w-full" : "w-0"
          }`}
        />
      </Link>
      {link.hasDropdown && (
        <ChevronDown
          className={`w-4 h-4 transition-colors duration-200 ${
            isHovered ? "text-[#068847]" : "text-gray-500"
          }`}
        />
      )}

      {/* Mega Menu */}
      {link.megaMenu && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 pt-2 invisible opacity-0 z-50"
        >
          <div className="bg-white shadow-xl rounded-md p-6 w-[800px] grid grid-cols-3 gap-8 border-t-2 border-[#068847]">
            {link.megaMenu.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-2">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-600 hover:text-[#068847] text-[15px] transition-colors duration-200 block hover:translate-x-1 transform"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple Dropdown */}
      {link.dropdownItems && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 pt-2 invisible opacity-0 z-50 w-64"
        >
          <div className="bg-white shadow-xl rounded-md py-2 border-t-2 border-[#068847]">
            <ul className="flex flex-col">
              {link.dropdownItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-[#068847] text-[15px] px-6 py-2 block hover:bg-gray-50 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: "Home", href: "/", hasDropdown: false },
    {
      name: "About",
      href: "/about",
      hasDropdown: true,
      megaMenu: [
        {
          title: "Who We Are",
          items: [
            { name: "About Us", href: "/about" },
            { name: "About The Founder", href: "/about/founder" },
            { name: "Advisory Council", href: "/about/advisory-council" },
            { name: "Governing Body", href: "/about/governing-body" },
            { name: "Executive Body", href: "/about/executive-body" },
            { name: "Our Staff", href: "/about/staff" },
          ],
        },
        {
          title: "At A Glance",
          items: [
            { name: "Profile", href: "/about/profile" },
            { name: "Awards & Recognition", href: "/about/awards" },
            { name: "Annual Report", href: "/about/annual-report" },
            { name: "Rules", href: "/about/rules" },
            { name: "Organogram", href: "/about/organogram" },
          ],
        },
        {
          title: "What We Do",
          items: [
            {
              name: "Social Development",
              href: "/about/what-we-do/social-development",
            },
            {
              name: "Social Enterprise",
              href: "/about/what-we-do/social-enterprise",
            },
          ],
        },
      ],
    },
    { name: "Our Project", href: "/projects/project", hasDropdown: false },
    {
      name: "Become A Member",
      href: "/membership",
      hasDropdown: true,
      dropdownItems: [
        // { name: "Executive Membership", href: "/membership/executive" },
        { name: "General Membership", href: "/membership/general" },
      ],
    },
    {
      name: "Blog/Media",
      href: "/blog",
      hasDropdown: true,
      dropdownItems: [
        { name: "Gallery", href: "/blog/gallery" },
        { name: "Video", href: "/blog/video" },
        { name: "Magazine", href: "/blog/magazine" },
        { name: "Calendar", href: "/blog/calendar" },
        { name: "Notices", href: "/blog/notices" },
        { name: "Careers", href: "/careers" },
      ],
    },
    { name: "Contracts", href: "/contact", hasDropdown: false },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-6"
      }`}
    >
      <GoogleTranslateScript />
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div
          className={`bg-white rounded-lg shadow-lg transition-all duration-300 ${
            isScrolled ? "shadow-md" : ""
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3 md:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative w-40 h-12 md:w-48 md:h-14">
                <Image
                  src="/logo.svg"
                  alt="Expro Welfare Foundation"
                  fill
                  sizes="373px"
                  style={{ objectFit: "contain", objectPosition: "left" }}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <DesktopNavItem key={link.name} link={link} />
              ))}
            </nav>

            {/* CTA Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <Link
                href="/donate"
                className="hidden sm:inline-flex items-center justify-center rounded-md bg-[#D62828] hover:bg-[#b81d1d] text-white font-semibold px-6 py-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Donate Now
              </Link>

              {/* Google Translator Button */}
              <div className="hidden sm:block">
                <GoogleTranslateButton />
              </div>

              {/* Mobile Menu Button */}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-gray-800 hover:text-gray-600 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden px-6 pb-6 pt-2 border-t border-gray-100 animate-in slide-in-from-top-2">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center justify-between py-2">
                      <Link
                        href={link.href}
                        className="text-gray-800 hover:text-[#068847] font-normal not-italic text-[16px] leading-[150%] tracking-[-0.16px] flex-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>

                      {link.megaMenu || link.dropdownItems ? (
                        <button
                          onClick={() =>
                            setExpandedMobileMenu(
                              expandedMobileMenu === link.name
                                ? null
                                : link.name,
                            )
                          }
                          className="p-2 text-gray-500 hover:text-[#068847]"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${expandedMobileMenu === link.name ? "rotate-180" : ""}`}
                          />
                        </button>
                      ) : (
                        link.hasDropdown && (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )
                      )}
                    </div>

                    {/* Mobile Submenu */}
                    {link.megaMenu && expandedMobileMenu === link.name && (
                      <div className="pl-2 pb-4 space-y-4 animate-in slide-in-from-top-1 fade-in duration-200">
                        {link.megaMenu.map((section) => (
                          <div key={section.title}>
                            <h4 className="font-semibold text-sm text-[#068847] mb-2 uppercase tracking-wide">
                              {section.title}
                            </h4>
                            <ul className="space-y-2 pl-3 border-l border-gray-100">
                              {section.items.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className="text-gray-600 hover:text-[#068847] text-sm block py-1"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mobile Simple Dropdown */}
                    {link.dropdownItems && expandedMobileMenu === link.name && (
                      <div className="pl-4 pb-4 space-y-2 animate-in slide-in-from-top-1 fade-in duration-200 border-l border-gray-100 ml-2">
                        {link.dropdownItems.map((item) => (
                          <div key={item.name}>
                            <Link
                              href={item.href}
                              className="text-gray-600 hover:text-[#068847] text-sm block py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  href="/donate"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center rounded-md bg-[#068847] hover:bg-[#056d39] text-white mt-4 font-medium h-10 px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Donate Now
                </Link>

                {/* Mobile Google Translator Button */}
                <div className="pt-2">
                  <GoogleTranslateButton className="w-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
