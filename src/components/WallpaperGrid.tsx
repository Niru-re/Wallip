import type { Wallpaper } from "@/types/wallpaper";
import { WallpaperCard } from "./WallpaperCard";

export function WallpaperGrid({
  wallpapers,
  emptyMessage = "No wallpapers found.",
}: {
  wallpapers: Wallpaper[];
  emptyMessage?: string;
}) {
  if (wallpapers.length === 0) {
    return (
      <p className="py-16 text-center text-white/50">{emptyMessage}</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {wallpapers.map((wallpaper, index) => (
        <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} index={index} />
      ))}
    </div>
  );
}
