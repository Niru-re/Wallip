import { notFound } from "next/navigation";
import { WallpaperDetail } from "@/components/WallpaperDetail";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";
import { getRelatedWallpapers, getWallpaperBySlug } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let wallpaper = MOCK_WALLPAPERS.find((w) => w.slug === slug);

  try {
    const supabaseWallpaper = await getWallpaperBySlug(slug);
    if (supabaseWallpaper) {
      wallpaper = supabaseWallpaper;
    }
  } catch {}

  if (!wallpaper) return { title: "Wallpaper Not Found" };

  return {
    title: `${wallpaper.title} — ${wallpaper.resolution} Wallpaper`,
    description:
      wallpaper.description ?? `Download ${wallpaper.title} wallpaper in ${wallpaper.resolution}.`,
  };
}

export default async function WallpaperPage({ params }: Props) {
  const { slug } = await params;
  console.log("🖼️ Wallpaper detail page loading for slug:", slug);
  
  let wallpaper = MOCK_WALLPAPERS.find((w) => w.slug === slug);

  try {
    const supabaseWallpaper = await getWallpaperBySlug(slug);
    if (supabaseWallpaper) {
      wallpaper = supabaseWallpaper;
      console.log("✅ Using Supabase wallpaper:", { id: wallpaper.id, title: wallpaper.title, image_url: wallpaper.image_url });
    }
  } catch (error) {
    console.warn("Using mock wallpaper because Supabase is not ready:", error);
  }

  if (!wallpaper) notFound();
  console.log("🎨 Final wallpaper loaded:", { id: wallpaper.id, title: wallpaper.title, image_url: wallpaper.image_url });

  let related = MOCK_WALLPAPERS.filter(
    (w) => w.category === wallpaper.category && w.id !== wallpaper.id
  );

  try {
    const data = await getRelatedWallpapers(wallpaper.id, wallpaper.category);
    related = data.length ? data : related;
  } catch (error) {
    console.warn("Using mock related wallpapers because Supabase is not ready:", error);
  }

  return <WallpaperDetail key={wallpaper.id} wallpaper={wallpaper} related={related} />;
}
