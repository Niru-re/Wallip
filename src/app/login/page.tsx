"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setAlreadyLoggedIn(true);
    };
    checkUser();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase not configured. Please add environment variables.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  async function onLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAlreadyLoggedIn(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Login</h1>

      {!supabase ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-white/60 mb-2">Supabase not configured.</p>
          <p className="text-xs text-white/40">Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.</p>
        </div>
      ) : alreadyLoggedIn ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="mb-4">You are already logged in.</p>
          <button
            type="button"
            onClick={onLogout}
            disabled={loading}
            className="w-full rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full block rounded-md border border-white/15 bg-white/5 px-4 py-2 text-center text-sm font-medium text-white/80 hover:bg-white/10"
            >
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-white/60">
            New here?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-white underline underline-offset-4"
            >
              Create account
            </button>
          </p>
        </form>
      )}
    </div>
  );
}