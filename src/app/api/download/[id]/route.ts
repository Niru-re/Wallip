import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { MOCK_WALLPAPERS } from "@/lib/mock-data";

// Set this to true to use Supabase, false to use only mock data
const USE_SUPABASE = true;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("📥 Download route hit for wallpaper ID:", id);

  let wallpaper: (typeof MOCK_WALLPAPERS)[0] | null = null;

  // First check Supabase if enabled!
  if (USE_SUPABASE) {
    console.log("🔍 Trying Supabase first...");
    const cookieStore = await cookies(); // FIX: Add await here!
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase =
      supabaseUrl && supabaseAnonKey
        ? createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
              get: (name) => {
                try {
                  const cookie = cookieStore.get(name);
                  return cookie?.value;
                } catch {
                  return undefined;
                }
              },
              set() {}, // NO OP
              remove() {}, // NO OP
            },
          })
        : null;

    if (supabase) {
      console.log("✅ Supabase client created");
      const { data, error } = await supabase
        .from("wallpapers")
        .select("id, slug, image_url, title, thumbnail_url, category, device_type, resolution, width, height, dominant_color, downloads, views, created_at")
        .eq("id", id)
        .single();

      if (!error && data) {
        // Convert Supabase data to match mock shape
        wallpaper = {
          ...data,
          tags: []
        } as any;

        console.log("✅ Supabase found wallpaper for download:", { 
          id: wallpaper.id, 
          title: wallpaper.title, 
          slug: wallpaper.slug,
          image_url: wallpaper.image_url 
        });
      } else if (error) {
        console.log("⚠️ Supabase error finding wallpaper:", error);
      } else {
        console.log("⚠️ Supabase returned no data for id:", id);
      }
    }
  }

  // If still no wallpaper, check mock data!
  if (!wallpaper) {
    console.log("🔍 Trying mock data...");
    wallpaper = MOCK_WALLPAPERS.find((w) => w.id === id) || null;
    console.log("📋 Mock wallpaper result:", wallpaper ? { id: wallpaper.id, title: wallpaper.title, image_url: wallpaper.image_url } : "not found");
  }

  // Final check
  if (!wallpaper) {
    console.log("❌ Wallpaper not found at all");
    return NextResponse.json(
      { success: false, error: "Wallpaper not found" },
      { status: 404 }
    );
  }

  if (!wallpaper.image_url) {
    console.log("❌ No image_url found on wallpaper");
    return NextResponse.json(
      { success: false, error: "Wallpaper image_url is missing" },
      { status: 400 }
    );
  }

  console.log("📤 Fetching image from:", wallpaper.image_url);

  try {
    // Track download (best-effort)
    if (USE_SUPABASE) {
      const cookieStore = await cookies(); // FIX: Add await here too!
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const supabase =
        supabaseUrl && supabaseAnonKey
          ? createServerClient(supabaseUrl, supabaseAnonKey, {
              cookies: {
                get: (name) => {
                  try {
                    const cookie = cookieStore.get(name);
                    return cookie?.value;
                  } catch {
                    return undefined;
                  }
                },
                set() {},
                remove() {},
              },
            })
          : null;

      if (supabase) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          await supabase.rpc("increment_downloads", { wallpaper_uuid: id });

          // Track download event with user_id if user is logged in
          if (user) {
            await supabase.from("download_events").insert({
              wallpaper_id: id,
              user_id: user.id,
            });
          }
        } catch (err) {
          console.log("⚠️ Download tracking failed, continuing:", err);
        }
      }
    }

    // Get the image
    const upstream = await fetch(wallpaper.image_url, {
      method: "GET",
      headers: {
        "User-Agent": "wallip-download",
      },
    });

    if (!upstream.ok || !upstream.body) {
      console.log("❌ Upstream image fetch failed:", upstream.status);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch image",
          status: upstream.status,
        },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

    // Stream the image back as an attachment
    console.log("✅ Sending download response...");
    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${wallpaper.slug}.jpg"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.log("❌ Unhandled download error:", e);
    return NextResponse.json(
      { success: false, error: "Internal download error" },
      { status: 500 }
    );
  }
}
