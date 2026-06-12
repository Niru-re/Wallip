import { createClient } from "@supabase/supabase-js";
import type { Wallpaper, WallpaperFilters } from "@/types/wallpaper";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function normalizeSupabaseUrl(url: string) {
  const trimmed = url.trim();
  // Supabase URL should look like: https://xxxx.supabase.co
  // If user accidentally pasted only the project ref, prefix with https.
  if (/^[a-zA-Z0-9_-]+\.supabase\.co$/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

const supabaseUrlNormalized = supabaseUrl ? normalizeSupabaseUrl(supabaseUrl) : undefined;

export const supabase = (() => {
  if (!supabaseUrlNormalized || !supabaseAnonKey) return null;

  // Supabase client validates URL. If env var is wrong, throw a clear error.
  const url = supabaseUrlNormalized;
  const looksLikeHttp = /^https?:\/\//i.test(url);
  if (!looksLikeHttp) {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL: "${url}". Expected an HTTP/HTTPS Supabase project URL (e.g. https://xxxx.supabase.co).`
    );
  }

  return createClient(url, supabaseAnonKey);
})();

function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
    );
  }

  return supabase;
}

type WallpaperRow = Omit<Wallpaper, "tags"> & {
  wallpaper_tags?: {
    tags?: { name?: string } | { name?: string }[] | null;
  }[];
};

function mapWallpaper(row: WallpaperRow): Wallpaper {
  return {
    ...row,
    tags:
      row.wallpaper_tags
        ?.flatMap((item) => item.tags ?? [])
        .map((tag) => tag.name)
        .filter((name): name is string => Boolean(name)) ?? [],
  };
}

export async function getWallpapers(filters: WallpaperFilters = {}) {
  const supabase = getSupabaseClient();
  const { q, category, device, resolution, color, page = 1, limit = 24 } = filters;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("wallpapers")
    .select("*, wallpaper_tags(tags(name))", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category) query = query.eq("category", category);
  if (device) query = query.eq("device_type", device);
  if (resolution) query = query.eq("resolution", resolution);
  if (color) query = query.ilike("dominant_color", `%${color}%`);
  if (q) query = query.textSearch("search_vector", q);

  const { data, error, count } = await query;
  if (error) throw error;

  return { wallpapers: (data as WallpaperRow[]).map(mapWallpaper), total: count ?? 0 };
}

export async function getWallpaperBySlug(slug: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("wallpapers")
    .select("*, wallpaper_tags(tags(name))")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) throw error;
  return mapWallpaper(data as WallpaperRow);
}

export async function getFeaturedWallpapers(limit = 12) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("wallpapers")
    .select("*, wallpaper_tags(tags(name))")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as WallpaperRow[]).map(mapWallpaper);
}

export async function getTrendingWallpapers(limit = 24) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("wallpapers")
    .select("*, wallpaper_tags(tags(name))")
    .eq("is_published", true)
    .order("downloads", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as WallpaperRow[]).map(mapWallpaper);
}

export async function getRelatedWallpapers(
  wallpaperId: string,
  category: string,
  limit = 8
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("wallpapers")
    .select("*, wallpaper_tags(tags(name))")
    .eq("is_published", true)
    .eq("category", category)
    .neq("id", wallpaperId)
    .order("downloads", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as WallpaperRow[]).map(mapWallpaper);
}
