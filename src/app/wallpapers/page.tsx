import { PageShell } from "@/components/PageShell";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { getWallpapers } from "@/lib/supabase";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse All Wallpapers",
  description: "Browse our full collection of free HD, 4K, and AMOLED wallpapers.",
};

export default async function WallpapersPage() {
  let wallpapers = MOCK_WALLPAPERS;

  try {
    const data = await getWallpapers();
    wallpapers = data.wallpapers.length ? data.wallpapers : MOCK_WALLPAPERS;
  } catch (error) {
    console.warn("Using mock wallpapers because Supabase is not ready:", error);
  }

  return (
    <PageShell
      title="All Wallpapers"
      description="Browse our full collection of free HD, 4K, and AMOLED wallpapers."
    >
      <WallpaperGrid wallpapers={wallpapers} />
    </PageShell>
  );
}
