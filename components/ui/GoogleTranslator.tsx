"use client";

import React, { useEffect, useState } from "react";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export function GoogleTranslateScript() {
  useEffect(() => {
    // Check if script is already added
    if (document.querySelector("script[src*='translate.google.com']")) {
      return;
    }

    // Add Google Translate script
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,bn",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
      <style jsx global>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        .goog-tooltip {
          display: none !important;
        }
        .goog-te-gadget-simple {
          display: none !important;
        }
      `}</style>
    </>
  );
}

export function GoogleTranslateButton({ className }: { className?: string }) {
  const [isTranslated, setIsTranslated] = useState(false);

  useEffect(() => {
    // Check initial state from cookie
    const checkCookie = () => {
      const cookies = document.cookie.split(";");
      const googtrans = cookies.find((c) => c.trim().startsWith("googtrans="));
      if (googtrans && googtrans.includes("/bn")) {
        setIsTranslated(true);
      } else {
        setIsTranslated(false);
      }
    };
    checkCookie();
  }, []);

  const handleTranslate = () => {
    if (isTranslated) {
      // Switch back to English
      document.cookie = "googtrans=/en/en; path=/; domain=" + window.location.hostname;
      document.cookie = "googtrans=/en/en; path=/";
      window.location.reload();
    } else {
      // Switch to Bangla
      document.cookie = "googtrans=/en/bn; path=/; domain=" + window.location.hostname;
      document.cookie = "googtrans=/en/bn; path=/";
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleTranslate}
      className={`flex items-center justify-center gap-2 rounded-md border border-[#068847] text-[#068847] hover:bg-[#068847] hover:text-white font-semibold px-4 py-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#068847] ${className || ""}`}
      aria-label={isTranslated ? "Switch to English" : "Switch to Bangla"}
    >
      <Globe size={18} />
      <span>{isTranslated ? "English" : "বাংলা"}</span>
    </button>
  );
}
