import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { CATEGORIES } from "@/lib/constants";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";
import { getWallpapers } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.label} Wallpapers`,
    description: `Download free ${cat.label.toLowerCase()} wallpapers in HD and 4K.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  let wallpapers = MOCK_WALLPAPERS.filter((w) => w.category === category);

  try {
    const data = await getWallpapers({ category });
    wallpapers = data.wallpapers.length ? data.wallpapers : wallpapers;
  } catch (error) {
    console.warn("Using mock wallpapers because Supabase is not ready:", error);
  }

  return (
    <PageShell title={`${cat.label} Wallpapers`} description={cat.description}>
      <WallpaperGrid
        wallpapers={wallpapers}
        emptyMessage={`No ${cat.label.toLowerCase()} wallpapers yet. Check back soon!`}
      />
    </PageShell>
  );
}
