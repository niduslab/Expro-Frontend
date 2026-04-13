// page.tsx - FIXED
"use client";

import { useState } from "react";
import { Images, ImageIcon } from "lucide-react";
import GalleriesTab from "./GalleriesTab";
import GalleryImagesTab from "./GalleryImagesTab";

const TABS = [
  { key: "galleries", label: "Galleries", icon: Images },
  { key: "images", label: "Gallery Images", icon: ImageIcon },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export default function GalleryPageAdmin() {
  const [activeTab, setActiveTab] = useState<TabKey>("galleries");
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(
    null,
  ); // ← just the id
  const [selectedGalleryTitle, setSelectedGalleryTitle] = useState<string>("");

  const handleViewImages = (gallery: { id: number; title: string }) => {
    setSelectedGalleryId(gallery.id);
    setSelectedGalleryTitle(gallery.title);
    setActiveTab("images");
  };

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      <div className="bg-white border-b border-[#e8e6e0] max-w-7xl mx-auto">
        <div className="container">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Gallery
          </p>
          <p className="text-sm text-[#4A5565] mt-1 mb-5">
            Manage galleries and their images from one place.
          </p>

          <div className="flex items-center gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabKey)}
                className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === key
                    ? "text-[#068847] bg-[#f8faf7]"
                    : "text-[#6A7282] hover:text-[#030712] hover:bg-[#f5f4f0]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {key === "images" && selectedGalleryId && (
                  <span className="text-xs text-[#8a8780] font-normal truncate max-w-[120px]">
                    — {selectedGalleryTitle}
                  </span>
                )}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#068847] rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="py-6 max-w-7xl mx-auto">
        {activeTab === "galleries" ? (
          <GalleriesTab onViewImages={handleViewImages} />
        ) : selectedGalleryId ? (
          <GalleryImagesTab galleryId={selectedGalleryId} /> // ← pass id only
        ) : (
          <div className="py-20 flex flex-col items-center gap-3 text-[#8a8780]">
            <Images className="w-10 h-10 text-[#D1D5DC]" />
            <p className="text-sm">Select a gallery to manage its images.</p>
            <button
              onClick={() => setActiveTab("galleries")}
              className="text-sm text-[#068847] underline underline-offset-2 font-medium"
            >
              Go to Galleries
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
