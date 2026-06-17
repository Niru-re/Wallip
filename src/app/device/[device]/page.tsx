import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { DEVICES } from "@/lib/constants";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";
import { getWallpapers } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ device: string }> };

export async function generateStaticParams() {
  return DEVICES.map((d) => ({ device: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { device } = await params;
  const dev = DEVICES.find((d) => d.slug === device);
  if (!dev) return { title: "Device Not Found" };

  return {
    title: `${dev.label} Wallpapers`,
    description: `Free wallpapers optimized for ${dev.label.toLowerCase()} devices.`,
  };
}

export default async function DevicePage({ params }: Props) {
  const { device } = await params;
  const dev = DEVICES.find((d) => d.slug === device);
  if (!dev) notFound();

  let wallpapers = MOCK_WALLPAPERS.filter((w) => w.device_type === device);

  try {
    const data = await getWallpapers({ device });
    wallpapers = data.wallpapers.length ? data.wallpapers : wallpapers;
  } catch (error) {
    console.warn("Using mock wallpapers because Supabase is not ready:", error);
  }

  return (
    <PageShell title={`${dev.label} Wallpapers`} description={dev.description}>
      <WallpaperGrid
        wallpapers={wallpapers}
        emptyMessage={`No ${dev.label.toLowerCase()} wallpapers yet.`}
      />
    </PageShell>
  );
}
