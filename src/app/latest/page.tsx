import { PageShell } from "@/components/PageShell";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";
import { getWallpapers } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest Wallpapers",
  description: "Newest wallpaper uploads, updated daily.",
};

export default async function LatestPage() {
  let latest = [...MOCK_WALLPAPERS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  try {
    const data = await getWallpapers({ limit: 24 });
    latest = data.wallpapers.length ? data.wallpapers : latest;
  } catch (error) {
    console.warn("Using mock wallpapers because Supabase is not ready:", error);
  }

  return (
    <PageShell title="Latest Wallpapers" description="Fresh uploads added recently.">
      <WallpaperGrid wallpapers={latest} />
    </PageShell>
  );
}
