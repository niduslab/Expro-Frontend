"use client";

import { useState } from "react";
import { FileText, FolderOpen } from "lucide-react";
import PostsTab from "./blog-posts/Poststab";
import CategoriesTab from "./blog-categories/Categoriestab";

const TABS = [
  { key: "posts", label: "Blog Posts", icon: FileText },
  { key: "categories", label: "Categories", icon: FolderOpen },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export default function BlogPageAdmin() {
  const [activeTab, setActiveTab] = useState<TabKey>("posts");

  return (
    <div className="min-h-screen font-['DM_Sans',sans-serif]">
      <div className="bg-white border-b border-[#e8e6e0] max-w-7xl mx-auto">
        <div className="container">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Blog
          </p>
          <p className="text-sm text-[#4A5565] mt-1 mb-5">
            Manage posts and categories from one place.
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
                {activeTab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#068847] rounded-t" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className=" py-6 max-w-7xl mx-auto">
        {activeTab === "posts" ? <PostsTab /> : <CategoriesTab />}
      </div>
    </div>
  );
}
