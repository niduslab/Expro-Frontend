"use client";

import React from "react";
import Link from "next/link";
import { FooterLogo } from "./FooterLogo";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "X (Twitter)" }, // X icon not available in older lucide versions, using Twitter as fallback or X if available. Lucide v0.263+ has X. I'll use Twitter for now as it's safer, or check if X exists.
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Blog & Media", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
  ];

  const OthersLinks = [
    { name: "Become a Member", href: "/membership" },
    { name: "Our Projects", href: "/projects/project" },
    { name: "Notices", href: "/blog/notices" },
    { name: "Career", href: "/careers" },
  ];

  return (
    <footer className="bg-[#00341C] text-white pt-16 pb-8 font-dm-sans ">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Logo & Description */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <FooterLogo className="h-12 w-auto" />
            </Link>
            <p className="text-gray-300 text-[15px] leading-relaxed max-w-sm">
              Expro Welfare Foundation is committed to uplifting communities
              through sustainable development, financial security, and social
              welfare initiatives.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon
                    size={18}
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-[15px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Others */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Others</h3>
            <ul className="space-y-4">
              {OthersLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-[15px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-300 mt-1 shrink-0" />
                <span className="text-gray-300 text-[15px]">
                  Boshundhara Villa, Sher-e-Bangla Nagar, Nishindara, Bogura
                  Sadar, Bogura-5800
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
                <a
                  href="mailto:ewf.bogura.bd@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors text-[15px] break-all"
                >
                  ewf.bogura.bd@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
                <a
                  href="tel:+8801308-483637"
                  className="text-gray-300 hover:text-white transition-colors text-[15px]"
                >
                  +88 01308-483637
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">
          <p>
            &copy; {currentYear} Expro Welfare Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-conditions"
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
