"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/login");
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Create account</h1>

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
            onClick={() => router.push("/")}
            disabled={loading}
            className="w-full rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 disabled:opacity-60"
          >
            Go to home
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
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
              placeholder="Re-enter password"
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
            {loading ? "Creating..." : "Create account"}
          </button>

          <p className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-white underline underline-offset-4"
            >
              Login
            </button>
          </p>
        </form>
      )}
    </div>
  );
}