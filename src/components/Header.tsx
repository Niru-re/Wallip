"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { glass } from "@/lib/glass";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/trending", label: "Trending" },
  { href: "/latest", label: "Latest" },
  { href: "/wallpapers", label: "Browse" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  async function onLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="pointer-events-none fixed top-6 left-0 right-0 z-50 px-4">
      <div
        className={`pointer-events-auto mx-auto flex w-[92%] max-w-4xl items-center justify-center gap-1 px-2 py-2 sm:gap-2 sm:px-4 ${glass.nav}`}
      >
        <Link
          href="/"
          className="shrink-0 px-3 py-2 text-sm font-semibold tracking-tight text-white sm:px-4 sm:text-base"
        >
          {SITE_NAME}
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {loading || !supabase ? null : user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="rounded-full px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

