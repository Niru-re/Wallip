import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

import { mysqlPool } from "@/lib/mysql";


const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

const SESSION_COOKIE_NAME = "wallip_session";

function getExpiresAt(hours = 24) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

type GoogleUserInfo = {
  sub?: string;
  id?: string;
  email?: string;
  // name?: string;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }
    if (!state) {
      return NextResponse.json({ error: "Missing state" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const expectedState = cookieStore.get("wallip_oauth_state")?.value;
    if (!expectedState || expectedState !== state) {
      return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: "Missing Google OAuth environment variables" },
        { status: 500 }
      );
    }

    // Exchange code -> tokens
    const tokenRes = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text().catch(() => "");
      return NextResponse.json(
        { error: "Google token exchange failed", details: text },
        { status: 400 }
      );
    }

    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    const accessToken = tokenJson.access_token;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing access_token from Google" },
        { status: 400 }
      );
    }

    // Fetch userinfo
    const userInfoRes = await fetch(GOOGLE_USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoRes.ok) {
      const text = await userInfoRes.text().catch(() => "");
      return NextResponse.json(
        { error: "Failed to fetch Google user info", details: text },
        { status: 400 }
      );
    }

    const userInfo = (await userInfoRes.json()) as GoogleUserInfo;

    const googleSub = userInfo.sub ?? userInfo.id;
    const emailRaw = userInfo.email;

    if (!googleSub) {
      return NextResponse.json({ error: "Missing Google user id" }, { status: 400 });
    }
    if (!emailRaw || !emailRaw.includes("@")) {
      return NextResponse.json({ error: "Missing/invalid email from Google" }, { status: 400 });
    }

    const email = String(emailRaw).trim().toLowerCase();

    if (!mysqlPool) {
      return NextResponse.json(
        { error: "MySQL not configured." },
        { status: 500 }
      );
    }

    const pool = mysqlPool;

    // Find user by google_sub, fallback to email.
    // We expect google_sub to be unique (see schema).
    const [bySub] = await pool.query(

      `SELECT id, email, password_hash, google_sub
       FROM users
       WHERE google_sub = ?
       LIMIT 1`,
      [googleSub]
    );

    const typedBySub = bySub as unknown as Array<{
      id: number;
      email: string;
    }>;

    let userId: number | null = typedBySub?.[0]?.id ?? null;

    if (!userId) {
      const [byEmail] = await mysqlPool.query(
        `SELECT id, email, password_hash, google_sub
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [email]
      );
      const typedByEmail = byEmail as unknown as Array<{ id: number; email: string }>;
      if (typedByEmail?.[0]?.id) {
        userId = typedByEmail[0].id;
        // Associate the email account with google_sub.
        await mysqlPool.query(
          `UPDATE users SET google_sub = ? WHERE id = ?`,
          [googleSub, userId]
        );
      }
    }

    if (!userId) {
      // Create new OAuth user with NULL password_hash.
      const [insertRes] = await pool.query(

        `INSERT INTO users (email, password_hash, google_sub)
         VALUES (?, NULL, ?)`,
        [email, googleSub]
      );

      // mysql2 returns different shapes for insert results; insertId is generally available.
      // Keep typing strict to satisfy lint.
      const insertId = typeof (insertRes as { insertId?: number })?.insertId === "number"
        ? (insertRes as { insertId?: number }).insertId
        : undefined;

      if (!insertId) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }
      userId = insertId;

    }

    // Create session token + cookie
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = getExpiresAt(24);

    await mysqlPool.query(
      `INSERT INTO user_sessions (session_token, user_id, expires_at)
       VALUES (?, ?, ?)`,
      [sessionToken, userId, expiresAt]
    );

    // Clear state cookie
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    });

    res.cookies.set("wallip_oauth_state", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0),
    });

    return res;
  } catch (err) {
    console.error("/api/auth/google/callback error:", err);
    return NextResponse.json(
      { error: "Google login failed." },
      { status: 500 }
    );
  }
}

