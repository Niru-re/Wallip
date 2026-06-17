import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Wallpaper, WallpaperFilters } from "@/types/wallpaper";

// Set this to true to use Supabase, false to use only mock data
const USE_SUPABASE = true;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function normalizeSupabaseUrl(url: string) {
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]+\.supabase\.co$/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

const supabaseUrlNormalized = supabaseUrl ? normalizeSupabaseUrl(supabaseUrl) : undefined;

// Browser client
export const createBrowserClient = () => {
  if (!USE_SUPABASE) return null;
  if (!supabaseUrlNormalized || !supabaseAnonKey) return null;
  const url = supabaseUrlNormalized;
  const looksLikeHttp = /^https?:\/\//i.test(url);
  if (!looksLikeHttp) {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL: "${url}". Expected an HTTP/HTTPS Supabase project URL (e.g., https://xxxx.supabase.co).`
    );
  }
  return createClient(url, supabaseAnonKey);
};

// Server client for Server Components
export async function getSupabaseClient() {
  if (!USE_SUPABASE) return null;
  if (!supabaseUrlNormalized || !supabaseAnonKey) {
    return null;
  }
  try {
    const cookieStore = await cookies();
    return createServerClient(supabaseUrlNormalized, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          try {
            const cookie = cookieStore.get(name);
            return cookie?.value;
          } catch {
            return undefined;
          }
        },
        set() {
          // No-op - can't set cookies in server components
        },
        remove() {
          // No-op - can't remove cookies in server components
        },
      },
    });
  } catch {
    // If cookies() fails, just return null
    return null;
  }
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
  const supabase = await getSupabaseClient();
  if (!supabase) return { wallpapers: [], total: 0 };
  const { q, category, device, resolution, color, page = 1, limit = 24 } = filters;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
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
    if (error) {
      console.log("⚠️ Supabase getWallpapers error:", error);
      return { wallpapers: [], total: 0 };
    }

    return { wallpapers: (data as WallpaperRow[]).map(mapWallpaper), total: count ?? 0 };
  } catch (e) {
    console.log("⚠️ Exception in getWallpapers:", e);
    return { wallpapers: [], total: 0 };
  }
}

export async function getWallpaperBySlug(slug: string) {
  const supabase = await getSupabaseClient();
  if (!supabase) return null;
  console.log("🔍 Looking for wallpaper in Supabase by slug:", slug);
  try {
    const { data, error } = await supabase
      .from("wallpapers")
      .select("*, wallpaper_tags(tags(name))")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      console.log("⚠️ Supabase getWallpaperBySlug error:", error);
      return null;
    }
    if (data) {
      console.log("✅ Found wallpaper in Supabase by slug:", data);
      return mapWallpaper(data as WallpaperRow);
    }
    return null;
  } catch (e) {
    console.log("⚠️ Exception in getWallpaperBySlug:", e);
    return null;
  }
}

export async function getFeaturedWallpapers(limit = 12) {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("wallpapers")
      .select("*, wallpaper_tags(tags(name))")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("⚠️ Supabase getFeaturedWallpapers error:", error);
      return [];
    }
    return (data as WallpaperRow[]).map(mapWallpaper);
  } catch (e) {
    console.log("⚠️ Exception in getFeaturedWallpapers:", e);
    return [];
  }
}

export async function getTrendingWallpapers(limit = 24) {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("wallpapers")
      .select("*, wallpaper_tags(tags(name))")
      .eq("is_published", true)
      .order("downloads", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("⚠️ Supabase getTrendingWallpapers error:", error);
      return [];
    }
    return (data as WallpaperRow[]).map(mapWallpaper);
  } catch (e) {
    console.log("⚠️ Exception in getTrendingWallpapers:", e);
    return [];
  }
}

export async function getRelatedWallpapers(
  wallpaperId: string,
  category: string,
  limit = 8
) {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("wallpapers")
      .select("*, wallpaper_tags(tags(name))")
      .eq("is_published", true)
      .eq("category", category)
      .neq("id", wallpaperId)
      .order("downloads", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("⚠️ Supabase getRelatedWallpapers error:", error);
      return [];
    }
    return (data as WallpaperRow[]).map(mapWallpaper);
  } catch (e) {
    console.log("⚠️ Exception in getRelatedWallpapers:", e);
    return [];
  }
}

// Favorites functions
export async function toggleFavorite(userId: string, wallpaperId: string) {
  const supabase = await getSupabaseClient();
  if (!supabase) return { favorited: false };
  const { data: existing } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("wallpaper_id", wallpaperId)
    .single();

  if (existing) {
    await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("wallpaper_id", wallpaperId);
    return { favorited: false };
  } else {
    await supabase
      .from("user_favorites")
      .insert({ user_id: userId, wallpaper_id: wallpaperId });
    return { favorited: true };
  }
}

export async function getUserFavorites(userId: string) {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("user_favorites")
    .select("wallpapers(*, wallpaper_tags(tags(name)))")
    .eq("user_id", userId);

  return (data || []).map((item: any) => item.wallpapers && mapWallpaper(item.wallpapers)).filter(Boolean);
}

export async function getUserDownloads(userId: string) {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("download_events")
    .select("wallpapers(*, wallpaper_tags(tags(name)))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data || []).map((item: any) => item.wallpapers && mapWallpaper(item.wallpapers)).filter(Boolean);
}
