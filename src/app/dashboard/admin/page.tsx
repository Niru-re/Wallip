import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { GlassPanel } from "@/components/GlassPanel";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO: Add role check here if needed

  const supabaseAdmin = getSupabaseAdmin();

  // Get total stats
  const [
    totalUsersResult,
    totalWallpapersResult,
    totalDownloadsResult,
    totalViewsResult,
    totalFavoritesResult,
  ] = await Promise.all([
    // Note: To get auth.users, we need to use the service role and SQL query.
    (async () => {
      const { data, error } = await supabaseAdmin.rpc('get_user_count');
      if (error) {
        // Fallback if RPC not available
        return { count: 0 };
      }
      return { count: data || 0 };
    })(),
    supabaseAdmin.from("wallpapers").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("download_events").select("*", { count: "exact", head: true }),
    // For total views, sum the views column on wallpapers
    (async () => {
      const { data } = await supabaseAdmin
        .from("wallpapers")
        .select("views");
      const sum = (data || []).reduce((acc, curr) => acc + (curr.views || 0), 0);
      return { count: sum };
    })(),
    supabaseAdmin.from("user_favorites").select("*", { count: "exact", head: true }),
  ]);

  const totalUsers = totalUsersResult.count ?? 0;
  const totalWallpapers = totalWallpapersResult.count ?? 0;
  const totalDownloads = totalDownloadsResult.count ?? 0;
  const totalViews = totalViewsResult.count ?? 0;
  const totalFavorites = totalFavoritesResult.count ?? 0;

  // Get recent downloads
  const { data: recentDownloads } = await supabaseAdmin
    .from("download_events")
    .select("*, wallpapers(*)")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <GlassPanel className="p-6">
          <p className="text-white/60 text-sm">Total Users</p>
          <p className="text-3xl font-bold mt-1">{totalUsers || 0}</p>
        </GlassPanel>
        <GlassPanel className="p-6">
          <p className="text-white/60 text-sm">Total Wallpapers</p>
          <p className="text-3xl font-bold mt-1">{totalWallpapers || 0}</p>
        </GlassPanel>
        <GlassPanel className="p-6">
          <p className="text-white/60 text-sm">Total Downloads</p>
          <p className="text-3xl font-bold mt-1">{totalDownloads || 0}</p>
        </GlassPanel>
        <GlassPanel className="p-6">
          <p className="text-white/60 text-sm">Total Views</p>
          <p className="text-3xl font-bold mt-1">{totalViews || 0}</p>
        </GlassPanel>
        <GlassPanel className="p-6">
          <p className="text-white/60 text-sm">Total Favorites</p>
          <p className="text-3xl font-bold mt-1">{totalFavorites || 0}</p>
        </GlassPanel>
      </div>

      {/* Recent Downloads */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Downloads</h2>
        <GlassPanel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Wallpaper</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Date</th>
                </tr>
              </thead>
              <tbody>
                {(recentDownloads || []).map((download) => (
                  <tr key={download.id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white">
                      {download.wallpapers?.title || "Unknown"}
                    </td>
                    <td className="py-3 px-4 text-white/60 text-sm">
                      {new Date(download.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
