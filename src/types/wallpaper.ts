export type DeviceType = "mobile" | "desktop" | "laptop" | "tablet" | "ultrawide";

export type WallpaperCategory =
  | "nature"
  | "space"
  | "abstract"
  | "minimalist"
  | "dark"
  | "amoled"
  | "cars"
  | "bikes"
  | "gaming"
  | "anime"
  | "technology"
  | "architecture"
  | "animals"
  | "sports"
  | "movies"
  | "tv-shows";

export interface Wallpaper {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: WallpaperCategory;
  device_type: DeviceType;
  resolution: string;
  width: number;
  height: number;
  image_url: string;
  thumbnail_url: string;
  dominant_color: string | null;
  downloads: number;
  views: number;
  tags: string[];
  created_at: string;
}

export interface WallpaperFilters {
  q?: string;
  category?: string;
  device?: string;
  resolution?: string;
  color?: string;
  page?: number;
  limit?: number;
}
