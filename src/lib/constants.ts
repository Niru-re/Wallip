import type { DeviceType, WallpaperCategory } from "@/types/wallpaper";

export const SITE_NAME = "Wallip";
export const SITE_DESCRIPTION =
  "Free HD, 4K, and AMOLED wallpapers for mobile, desktop, and laptop.";

export const CATEGORIES: {
  slug: WallpaperCategory;
  label: string;
  description: string;
}[] = [
  { slug: "nature", label: "Nature", description: "Landscapes, forests, oceans, and mountains" },
  { slug: "space", label: "Space", description: "Galaxies, planets, nebulae, and stars" },
  { slug: "abstract", label: "Abstract", description: "Shapes, gradients, and creative art" },
  { slug: "minimalist", label: "Minimalist", description: "Clean, simple, and elegant designs" },
  { slug: "dark", label: "Dark", description: "Dark-themed wallpapers for OLED screens" },
  { slug: "amoled", label: "AMOLED", description: "True black backgrounds for AMOLED displays" },
  { slug: "cars", label: "Cars", description: "Supercars, classics, and automotive photography" },
  { slug: "bikes", label: "Bikes", description: "Motorcycles and cycling wallpapers" },
  { slug: "gaming", label: "Gaming", description: "Game art, characters, and scenes" },
  { slug: "anime", label: "Anime", description: "Anime characters, scenes, and fan art" },
  { slug: "technology", label: "Technology", description: "Gadgets, circuits, and futuristic tech" },
  { slug: "architecture", label: "Architecture", description: "Buildings, interiors, and cityscapes" },
  { slug: "animals", label: "Animals", description: "Wildlife, pets, and animal photography" },
  { slug: "sports", label: "Sports", description: "Athletes, stadiums, and action shots" },
  { slug: "movies", label: "Movies", description: "Film posters, scenes, and cinematic art" },
  { slug: "tv-shows", label: "TV Shows", description: "Series artwork and iconic moments" },
];

export const DEVICES: {
  slug: DeviceType;
  label: string;
  description: string;
}[] = [
  { slug: "mobile", label: "Mobile", description: "iPhone, Android, and vertical wallpapers" },
  { slug: "desktop", label: "Desktop", description: "Full HD, QHD, 4K, and 5K monitors" },
  { slug: "laptop", label: "Laptop", description: "MacBook and standard laptop resolutions" },
  { slug: "tablet", label: "Tablet", description: "iPad and Android tablet wallpapers" },
  { slug: "ultrawide", label: "Ultrawide", description: "21:9 and 32:9 ultrawide monitors" },
];

export const RESOLUTIONS: {
  slug: string;
  label: string;
  width: number;
  height: number;
  device: DeviceType;
}[] = [
  { slug: "1080x1920", label: "1080×1920", width: 1080, height: 1920, device: "mobile" },
  { slug: "1170x2532", label: "1170×2532", width: 1170, height: 2532, device: "mobile" },
  { slug: "1284x2778", label: "1284×2778", width: 1284, height: 2778, device: "mobile" },
  { slug: "1440x3200", label: "1440×3200", width: 1440, height: 3200, device: "mobile" },
  { slug: "1366x768", label: "1366×768", width: 1366, height: 768, device: "laptop" },
  { slug: "1920x1080", label: "1920×1080", width: 1920, height: 1080, device: "desktop" },
  { slug: "2560x1440", label: "2560×1440", width: 2560, height: 1440, device: "desktop" },
  { slug: "3840x2160", label: "3840×2160 (4K)", width: 3840, height: 2160, device: "desktop" },
  { slug: "2560x1080", label: "2560×1080", width: 2560, height: 1080, device: "ultrawide" },
  { slug: "3440x1440", label: "3440×1440", width: 3440, height: 1440, device: "ultrawide" },
  { slug: "5120x1440", label: "5120×1440", width: 5120, height: 1440, device: "ultrawide" },
];

export const COLORS = [
  { slug: "black", label: "Black", hex: "#000000" },
  { slug: "white", label: "White", hex: "#ffffff" },
  { slug: "red", label: "Red", hex: "#ef4444" },
  { slug: "blue", label: "Blue", hex: "#3b82f6" },
  { slug: "green", label: "Green", hex: "#22c55e" },
  { slug: "purple", label: "Purple", hex: "#a855f7" },
  { slug: "orange", label: "Orange", hex: "#f97316" },
  { slug: "pink", label: "Pink", hex: "#ec4899" },
];
