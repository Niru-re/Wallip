import type { WallpaperFilters } from "@/types/wallpaper";

export function buildSearchParams(filters: WallpaperFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.device) params.set("device", filters.device);
  if (filters.resolution) params.set("resolution", filters.resolution);
  if (filters.color) params.set("color", filters.color);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatResolution(width: number, height: number): string {
  return `${width}x${height}`;
}

export function formatDownloads(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}
