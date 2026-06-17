import Link from "next/link";
import { GlassPanel } from "@/components/GlassPanel";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { CATEGORIES, COLORS, DEVICES, RESOLUTIONS } from "@/lib/constants";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/cn";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";
import { getWallpapers } from "@/lib/supabase";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export const metadata: Metadata = {
  title: "Search Wallpapers",
  description: "Search and filter wallpapers by keyword, category, resolution, and color.",
};

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        glass.chip,
        "px-3 py-1.5 text-xs",
        active ? "bg-white/25 text-white" : "text-white/70"
      )}
    >
      {children}
    </Link>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q ?? "";
  const category = params.category;
  const device = params.device;
  const resolution = params.resolution;
  const color = params.color;

  let results = MOCK_WALLPAPERS;

  try {
    const data = await getWallpapers({ q, category, device, resolution, color });
    results = data.wallpapers.length ? data.wallpapers : results;
  } catch (error) {
    console.warn("Using mock wallpapers because Supabase is not ready:", error);
  }

  if (q && results === MOCK_WALLPAPERS) {
    const lower = q.toLowerCase();
    results = results.filter(
      (w) =>
        w.title.toLowerCase().includes(lower) ||
        w.tags.some((t) => t.includes(lower)) ||
        w.category.includes(lower)
    );
  }

  if (category) results = results.filter((w) => w.category === category);
  if (device) results = results.filter((w) => w.device_type === device);
  if (resolution) results = results.filter((w) => w.resolution === resolution);
  if (color) results = results.filter((w) => w.dominant_color?.includes(color));


  return (
    <PageShell title="Search Wallpapers" description="Find wallpapers by keyword, device, or color.">
      <GlassPanel className="mb-8 max-w-lg p-4">
        <SearchBar defaultValue={q} />
      </GlassPanel>

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm text-white/40">Category</span>
        {CATEGORIES.slice(0, 6).map((cat) => (
          <FilterChip
            key={cat.slug}
            href={`/search?${new URLSearchParams({ ...(q && { q }), category: cat.slug }).toString()}`}
            active={category === cat.slug}
          >
            {cat.label}
          </FilterChip>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm text-white/40">Device</span>
        {DEVICES.map((dev) => (
          <FilterChip
            key={dev.slug}
            href={`/search?${new URLSearchParams({ ...(q && { q }), device: dev.slug }).toString()}`}
            active={device === dev.slug}
          >
            {dev.label}
          </FilterChip>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm text-white/40">Resolution</span>
        {RESOLUTIONS.slice(0, 5).map((res) => (
          <FilterChip
            key={res.slug}
            href={`/search?${new URLSearchParams({ ...(q && { q }), resolution: res.slug }).toString()}`}
            active={resolution === res.slug}
          >
            {res.label}
          </FilterChip>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <span className="text-sm text-white/40">Color</span>
        {COLORS.map((c) => (
          <Link
            key={c.slug}
            href={`/search?${new URLSearchParams({ ...(q && { q }), color: c.hex }).toString()}`}
            className={cn(glass.chip, "flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/70")}
          >
            <span
              className="h-3 w-3 rounded-full border border-white/30"
              style={{ backgroundColor: c.hex }}
            />
            {c.label}
          </Link>
        ))}
      </div>

      <p className="mb-6 text-sm text-white/45">{results.length} results</p>
      <WallpaperGrid wallpapers={results} />
    </PageShell>
  );
}
