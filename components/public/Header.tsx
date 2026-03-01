"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about", hasDropdown: true },
    { name: "Projects", href: "/projects/project", hasDropdown: true },
    { name: "Blog & Media", href: "/blog", hasDropdown: false },
    { name: "Become a Member", href: "/membership", hasDropdown: false },
    { name: "Contact", href: "/contact", hasDropdown: false },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-6"
      }`}
    >
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
                <div
                  key={link.name}
                  className="relative group flex items-center gap-1 cursor-pointer"
                >
                  <Link
                    href={link.href}
                    className="relative text-gray-800 hover:text-[#DC2626] font-normal not-italic text-[16px] leading-[150%] tracking-[-0.16px] transition-colors duration-200"
                  >
                    {link.name}
                    {/* Hover Underline Animation */}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#DC2626] transition-all duration-300 group-hover:w-full" />
                  </Link>
                  {link.hasDropdown && (
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-[#DC2626] transition-colors duration-200" />
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <Link
                href="/donate"
                className="hidden sm:inline-flex items-center justify-center rounded-md bg-[#DC2626] hover:bg-red-700 text-white font-semibold px-6 py-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Donate Now
              </Link>

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
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-800 hover:text-[#DC2626] font-normal not-italic text-[16px] leading-[150%] tracking-[-0.16px] py-2 border-b border-gray-50 last:border-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      {link.name}
                      {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                    </div>
                  </Link>
                ))}
                <Link
                  href="/donate"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center rounded-md bg-[#DC2626] hover:bg-red-700 text-white mt-4 font-medium h-10 px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
