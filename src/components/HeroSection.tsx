"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { GlassPanel } from "@/components/GlassPanel";
import { DEVICES } from "@/lib/constants";
import { glass } from "@/lib/glass";

export function HeroSection() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-28 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl text-center"
      >
        <GlassPanel className="px-6 py-10 sm:px-10 sm:py-14">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Find Stunning
            <span className="block bg-gradient-to-r from-cyan-200 via-white to-pink-200 bg-clip-text text-transparent">
              Wallpapers
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/60 sm:text-lg">
            HD, 4K, and AMOLED wallpapers for every screen — floating in liquid glass.
          </p>

          <div className="mt-8">
            <SearchBar large />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {DEVICES.map((device) => (
              <Link
                key={device.slug}
                href={`/device/${device.slug}`}
                className={`${glass.chip} px-4 py-2 text-sm text-white/80`}
              >
                {device.label}
              </Link>
            ))}
          </div>
        </GlassPanel>
      </motion.div>
    </section>
  );
}
