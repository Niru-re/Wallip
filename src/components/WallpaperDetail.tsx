"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { motion } from "framer-motion";
import { DownloadButton } from "@/components/DownloadButton";
import { GlassPanel } from "@/components/GlassPanel";
import { SectionHeading } from "@/components/SectionHeading";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { formatDownloads } from "@/lib/api";
import { glass } from "@/lib/glass";
import type { Wallpaper } from "@/types/wallpaper";

type WallpaperDetailProps = {
  wallpaper: Wallpaper;
  related: Wallpaper[];
};

function hexToRgb(hex: string) {
  const n = hex.replace("#", "");
  const num = parseInt(n, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function WallpaperDetail({ wallpaper, related }: WallpaperDetailProps) {
  console.log("🖼️ WallpaperDetail rendering wallpaper:", { id: wallpaper.id, title: wallpaper.title, image_url: wallpaper.image_url });
  const [ambient, setAmbient] = useState({
    primary: "#7dd3fc",
    secondary: "#f9a8d4",
    tertiary: "#a78bfa",
  });

  useEffect(() => {
    const fac = new FastAverageColor();
    fac
      .getColorAsync(wallpaper.image_url, { algorithm: "dominant" })
      .then((color) => {
        const { r, g, b } = hexToRgb(color.hex);
        setAmbient({
          primary: color.hex,
          secondary: `rgb(${Math.min(r + 40, 255)}, ${Math.min(g + 20, 255)}, ${Math.min(b + 60, 255)})`,
          tertiary: `rgb(${Math.max(r - 30, 0)}, ${Math.max(g - 20, 0)}, ${Math.min(b + 30, 255)})`,
        });
      })
      .catch(() => {});
  }, [wallpaper.image_url]);

  return (
    <div className="relative min-h-screen">
      {/* Wallpaper-driven ambient layer */}
      <div className="fixed inset-0 -z-40 overflow-hidden" aria-hidden>
        <Image
          key={wallpaper.id}
          src={wallpaper.image_url}
          alt=""
          fill
          className="object-cover scale-110 blur-3xl opacity-60"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, ${ambient.primary}55 0%, transparent 45%),
              radial-gradient(circle at 80% 20%, ${ambient.secondary}45 0%, transparent 40%),
              radial-gradient(circle at 50% 90%, ${ambient.tertiary}40 0%, transparent 50%),
              linear-gradient(180deg, rgba(10,10,20,0.3) 0%, rgba(10,10,20,0.85) 100%)
            `,
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassPanel className="overflow-hidden p-2 sm:p-3">
            <div className="overflow-hidden rounded-[1.25rem]">
              <Image
                key={wallpaper.id}
                src={wallpaper.image_url}
                alt={wallpaper.title}
                width={wallpaper.width}
                height={wallpaper.height}
                className="h-auto w-full"
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>

            <div className="px-4 py-6 sm:px-8 sm:py-8">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {wallpaper.title}
              </h1>
              {wallpaper.description && (
                <p className="mt-3 text-white/60">{wallpaper.description}</p>
              )}

              <dl className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: "Resolution", value: wallpaper.resolution },
                  { label: "Device", value: wallpaper.device_type },
                  { label: "Downloads", value: formatDownloads(wallpaper.downloads) },
                  {
                    label: "Category",
                    value: wallpaper.category,
                    href: `/category/${wallpaper.category}`,
                  },
                ].map((item) => (
                  <div key={item.label} className={`${glass.panelSm} p-4`}>
                    <dt className="text-xs uppercase tracking-wider text-white/45">{item.label}</dt>
                    <dd className="mt-1 font-medium capitalize text-white">
                      {item.href ? (
                        <Link href={item.href} className="hover:underline">
                          {item.value}
                        </Link>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8">
                <DownloadButton key={wallpaper.id} wallpaper={wallpaper} />
              </div>

              {wallpaper.tags.length > 0 && (
                <div className="mt-8">
                  <p className="mb-3 text-sm text-white/45">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {wallpaper.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className={glass.tag}
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassPanel>
        </motion.div>

        {related.length > 0 && (
          <section className="mt-16">
            <SectionHeading title="Related Wallpapers" />
            <WallpaperGrid wallpapers={related} />
          </section>
        )}
      </div>
    </div>
  );
}
