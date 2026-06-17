"use client";

import type { Wallpaper } from "@/types/wallpaper";
import { glass } from "@/lib/glass";

export function DownloadButton({ wallpaper }: { wallpaper: Wallpaper }) {
  console.log("📥 DownloadButton rendered for wallpaper:", { 
    id: wallpaper.id, 
    title: wallpaper.title, 
    image_url: wallpaper.image_url,
    type: typeof wallpaper.id
  });
  
  async function handleDownload() {
    console.log("🎯 handleDownload called for id:", wallpaper.id, "type:", typeof wallpaper.id);
    
    // Log all mock data ids
    const mockIds = require("@/lib/mock-data").MOCK_WALLPAPERS.map((w: any) => w.id);
    console.log("📋 All mock wallpaper IDs:", mockIds);
    
    console.log("🔬 Is id in mock data?", mockIds.includes(wallpaper.id));
    
    try {
      const res = await fetch(`/api/download/${wallpaper.id}`, {
        method: "POST",
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("❌ Download request failed:", res.status, errText);
        throw new Error(`Download request failed: ${res.status} ${errText}`);
      }

      const blob = await res.blob();
      if (!blob || blob.size === 0) throw new Error("Empty download blob");
      
      console.log("✅ Got blob, size:", blob.size);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${wallpaper.slug}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Download failed, using fallback:", error);
      // Fallback: open upstream image in a new tab (browser decides how to download)
      console.log("🔄 Using fallback image URL:", wallpaper.image_url);
      const link = document.createElement("a");
      link.href = wallpaper.image_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    }

  }

  return (
    <button
      onClick={handleDownload}
      className={`inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white ${glass.button}`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Download Wallpaper
    </button>
  );
}
