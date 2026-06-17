import { PageShell } from "@/components/PageShell";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";
import { getTrendingWallpapers } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending Wallpapers",
  description: "Most downloaded wallpapers this week.",
};

export default async function TrendingPage() {
  let trending = [...MOCK_WALLPAPERS].sort((a, b) => b.downloads - a.downloads);

  try {
    const data = await getTrendingWallpapers(24);
    trending = data.length ? data : trending;
  } catch (error) {
    console.warn("Using mock wallpapers because Supabase is not ready:", error);
  }

  return (
    <PageShell title="Trending Wallpapers" description="Most popular downloads right now.">
      <WallpaperGrid wallpapers={trending} />
    </PageShell>
  );
}
