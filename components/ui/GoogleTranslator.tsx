"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export function GoogleTranslateScript() {
  useEffect(() => {
    // Prevent duplicate script loading
    if (document.querySelector("script[src*='translate.google.com']")) {
      return;
    }

    // Add styles to hide top bar
    const style = document.createElement("style");
    style.id = "google-translate-styles";
    style.innerHTML = `
      /* Hide Google Translate top bar */
      body {
        top: 0 !important;
        position: static !important;
      }
      
      .skiptranslate iframe,
      .goog-te-banner-frame {
        display: none !important;
        visibility: hidden !important;
      }
      
      body > .skiptranslate {
        display: none !important;
      }
      
      html, body {
        margin-top: 0 !important;
        padding-top: 0 !important;
      }
      
      /* Hide the widget but keep it functional */
      .goog-te-gadget {
        display: none !important;
      }
      
      /* Bengali font for translated content */
      html[lang="bn"] *,
      body.translated-ltr *,
      body.translated-rtl *,
      font[style*="vertical-align: inherit"] {
        font-family: var(--font-noto-sans-bengali), 'Noto Sans Bengali', sans-serif !important;
      }
    `;
    document.head.appendChild(style);

    // Load Google Translate script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    
    // Initialize callback
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,bn",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };

    document.body.appendChild(script);

    // Remove top bar when it appears
    const removeTopBar = setInterval(() => {
      const iframe = document.querySelector(".goog-te-banner-frame");
      if (iframe) {
        iframe.remove();
      }
      if (document.body.style.top) {
        document.body.style.top = "0";
        document.body.style.position = "static";
      }
    }, 100);

    return () => {
      clearInterval(removeTopBar);
    };
  }, []);

  return (
    <div 
      id="google_translate_element" 
      style={{ 
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
    />
  );
}

export function GoogleTranslateButton({ className }: { className?: string }) {
  const [isTranslated, setIsTranslated] = useState(false);

  useEffect(() => {
    // Check cookie on mount
    const checkTranslation = () => {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("googtrans="));
      
      if (cookie) {
        const value = cookie.split("=")[1];
        setIsTranslated(value.includes("/bn"));
      }
    };

    checkTranslation();
  }, []);

  const toggleTranslation = () => {
    if (isTranslated) {
      // Reset to English
      document.cookie = "googtrans=; path=/; max-age=0";
      document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; max-age=0`;
    } else {
      // Set to Bengali
      document.cookie = "googtrans=/en/bn; path=/";
      document.cookie = `googtrans=/en/bn; path=/; domain=${window.location.hostname}`;
    }
    
    // Reload page to apply translation
    window.location.reload();
  };

  return (
    <button
      onClick={toggleTranslation}
      className={`notranslate flex items-center justify-center gap-2 rounded-md border border-[#068847] text-[#068847] hover:bg-[#068847] hover:text-white font-semibold px-4 py-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#068847] ${className || ""}`}
      aria-label={isTranslated ? "Switch to English" : "Switch to Bangla"}
    >
      <Globe size={18} />
      <span className="font-noto-sans-bengali">
        {isTranslated ? "English" : "বাংলা"}
      </span>
    </button>
  );
}
