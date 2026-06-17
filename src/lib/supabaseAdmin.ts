import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function normalizeSupabaseUrl(url: string) {
  const trimmed = url.trim();
  // Supabase URL should look like: https://xxxx.supabase.co
  // If user accidentally pasted only the project ref, prefix with https.
  if (/^[a-zA-Z0-9_-]+\.supabase\.co$/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

const supabaseUrlNormalized = supabaseUrl ? normalizeSupabaseUrl(supabaseUrl) : undefined;

if (!supabaseUrlNormalized) {
  // This file can still be imported in dev tooling without env configured.
  // We throw only on usage via getSupabaseAdmin.
}

export function getSupabaseAdmin() {
  if (!supabaseUrlNormalized) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL env var. Add it to .env.local"
    );
  }
  if (!supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY env var. Add it to .env.local"
    );
  }
  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY env var. Add it to .env.local"
    );
  }

  return createClient(supabaseUrlNormalized, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}

