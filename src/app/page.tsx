import { CategoryGrid } from "@/components/CategoryGrid";
import { HeroSection } from "@/components/HeroSection";
import { SectionHeading } from "@/components/SectionHeading";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";
import { getFeaturedWallpapers, getTrendingWallpapers, getWallpapers } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured = MOCK_WALLPAPERS.filter((w) => w.downloads > 10000);
  let trending = [...MOCK_WALLPAPERS].sort((a, b) => b.downloads - a.downloads);
  let latest = [...MOCK_WALLPAPERS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  try {
    const [featuredData, trendingData, latestData] = await Promise.all([
      getFeaturedWallpapers(8),
      getTrendingWallpapers(8),
      getWallpapers({ limit: 8 }),
    ]);

    featured = featuredData.length ? featuredData : featured;
    trending = trendingData.length ? trendingData : trending;
    latest = latestData.wallpapers.length ? latestData.wallpapers : latest;
    console.log("🏠 Home page loaded wallpapers:", {
      featuredCount: featured.length,
      trendingCount: trending.length,
      latestCount: latest.length,
      featuredFirst: featured[0] ? { title: featured[0].title, image_url: featured[0].image_url } : null,
      trendingFirst: trending[0] ? { title: trending[0].title, image_url: trending[0].image_url } : null,
      latestFirst: latest[0] ? { title: latest[0].title, image_url: latest[0].image_url } : null,
    });
  } catch (error) {
    console.warn("Using mock wallpapers because Supabase is not ready:", error);
  }

  return (
    <>
      <HeroSection />

      <div className="mx-auto max-w-7xl px-4 pb-16">
        <section className="mb-16">
          <SectionHeading title="Featured" href="/wallpapers" />
          <WallpaperGrid wallpapers={featured.length ? featured : MOCK_WALLPAPERS} />
        </section>

        <section className="mb-16">
          <SectionHeading title="Trending" href="/trending" />
          <WallpaperGrid wallpapers={trending} />
        </section>

        <section className="mb-16">
          <SectionHeading title="Latest Uploads" href="/latest" />
          <WallpaperGrid wallpapers={latest} />
        </section>

        <section>
          <SectionHeading title="Browse by Category" />
          <CategoryGrid />
        </section>
      </div>
    </>
  );
}
