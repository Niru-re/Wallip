import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GlassPanel } from "@/components/GlassPanel";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import type { Wallpaper } from "@/types/wallpaper";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) redirect("/login");

  // Get user's favorites
  const { data: favoritesData, error: favoritesError } = await supabase
    .from("user_favorites")
    .select("wallpapers(*)")
    .eq("user_id", user.id);

  // Get user's downloads
  const { data: downloadsData, error: downloadsError } = await supabase
    .from("download_events")
    .select("wallpapers(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const favorites = (favoritesData || []).map((item: any) => item.wallpapers).filter(Boolean);
  const downloads = (downloadsData || []).map((item: any) => item.wallpapers).filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 space-y-8">
      <GlassPanel className="p-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-white/60">Signed in as</p>
        <p className="mt-2 text-white text-lg">{user.email}</p>
      </GlassPanel>

      <section>
        <h2 className="text-xl font-semibold mb-4">My Favorites</h2>
        {favorites.length > 0 ? (
          <WallpaperGrid wallpapers={favorites} />
        ) : (
          <p className="text-white/60">You haven't added any favorites yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Download History</h2>
        {downloads.length > 0 ? (
          <WallpaperGrid wallpapers={downloads} />
        ) : (
          <p className="text-white/60">You haven't downloaded any wallpapers yet.</p>
        )}
      </section>
    </div>
  );
}

