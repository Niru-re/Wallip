import Link from "next/link";
import { GlassPanel } from "@/components/GlassPanel";
import { CATEGORIES, DEVICES, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto px-4 pb-8 pt-12">
      <GlassPanel className="mx-auto max-w-7xl p-8 sm:p-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">{SITE_NAME}</p>
            <p className="mt-2 text-sm text-white/50">
              Free HD, 4K, and AMOLED wallpapers for every device.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white/80">Categories</p>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white/80">Devices</p>
            <ul className="space-y-2">
              {DEVICES.map((device) => (
                <li key={device.slug}>
                  <Link
                    href={`/device/${device.slug}`}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {device.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white/80">Resolutions</p>
            <ul className="space-y-2">
              {["1920x1080", "2560x1440", "3840x2160", "1080x1920"].map((res) => (
                <li key={res}>
                  <Link
                    href={`/resolution/${res}`}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {res}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </GlassPanel>
    </footer>
  );
}
