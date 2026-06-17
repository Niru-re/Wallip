"use client";

import Image from "next/image";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Wallpaper } from "@/types/wallpaper";
import { formatDownloads } from "@/lib/api";
import { glass } from "@/lib/glass";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function WallpaperCard({ wallpaper, index = 0 }: { wallpaper: Wallpaper; index?: number }) {
  console.log("📸 WallpaperCard rendering wallpaper:", { id: wallpaper.id, title: wallpaper.title, thumbnail_url: wallpaper.thumbnail_url, image_url: wallpaper.image_url });
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!supabase) return;
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("user_favorites")
          .select("*")
          .eq("user_id", user.id)
          .eq("wallpaper_id", wallpaper.id)
          .single();
        setIsFavorited(!!data);
      }
    };
    checkAuth();
  }, [wallpaper.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !supabase) return;

    if (isFavorited) {
      await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("wallpaper_id", wallpaper.id);
      setIsFavorited(false);
    } else {
      await supabase
        .from("user_favorites")
        .insert({ user_id: user.id, wallpaper_id: wallpaper.id });
      setIsFavorited(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        scale={1.02}
        transitionSpeed={1200}
        className="transform-gpu"
      >
        <Link
          href={`/wallpaper/${wallpaper.slug}`}
          className={`group relative block overflow-hidden ${glass.panelSm} p-1.5 transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]`}
        >
          {user && supabase && (
            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 z-10 rounded-full bg-white/10 p-2 backdrop-blur-md transition-all hover:bg-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isFavorited ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          )}

          <div className="aspect-[3/4] overflow-hidden rounded-2xl sm:aspect-video">
            <Image
              key={wallpaper.id}
              src={wallpaper.thumbnail_url}
              alt={wallpaper.title}
              width={400}
              height={600}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
          </div>

          <div className="absolute inset-x-2 bottom-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:opacity-100">
            <p className="truncate text-sm font-medium text-white">{wallpaper.title}</p>
            <p className="text-xs text-white/60">
              {wallpaper.resolution} · {formatDownloads(wallpaper.downloads)} downloads
            </p>
          </div>
        </Link>
      </Tilt>
    </motion.div>
  );
}
