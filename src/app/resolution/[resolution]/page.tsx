import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { RESOLUTIONS } from "@/lib/constants";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";
import { getWallpapers } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ resolution: string }> };

export async function generateStaticParams() {
  return RESOLUTIONS.map((r) => ({ resolution: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resolution } = await params;
  const res = RESOLUTIONS.find((r) => r.slug === resolution);
  if (!res) return { title: "Resolution Not Found" };

  return {
    title: `${res.label} Wallpapers`,
    description: `Download free wallpapers in ${res.label} resolution.`,
  };
}

export default async function ResolutionPage({ params }: Props) {
  const { resolution } = await params;
  const res = RESOLUTIONS.find((r) => r.slug === resolution);
  if (!res) notFound();

  let wallpapers = MOCK_WALLPAPERS.filter((w) => w.resolution === resolution);

  try {
    const data = await getWallpapers({ resolution });
    wallpapers = data.wallpapers.length ? data.wallpapers : wallpapers;
  } catch (error) {
    console.warn("Using mock wallpapers because Supabase is not ready:", error);
  }

  return (
    <PageShell
      title={`${res.label} Wallpapers`}
      description={`Wallpapers optimized for ${res.width}×${res.height} displays.`}
    >
      <WallpaperGrid
        wallpapers={wallpapers}
        emptyMessage={`No wallpapers at ${res.label} yet.`}
      />
    </PageShell>
  );
}
