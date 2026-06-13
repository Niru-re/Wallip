import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { mysqlPool } from "@/lib/mysql";

const SESSION_COOKIE_NAME = "wallip_session";

function getExpiresAt(hours = 24) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailRaw = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!emailRaw || !emailRaw.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    const [rows] = await mysqlPool.query(
      "SELECT id, password_hash FROM users WHERE email = ? LIMIT 1",
      [emailRaw]
    );


    const typedRows = rows as unknown as Array<{ id: number; password_hash: string }>;
    if (typedRows.length === 0) {


      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = (typedRows as Array<{ id: number; password_hash: string }>)[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = getExpiresAt(24);

    await mysqlPool.query(
      "INSERT INTO user_sessions (session_token, user_id, expires_at) VALUES (?, ?, ?)",
      [sessionToken, user.id, expiresAt]
    );

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    });

    return res;
  } catch (err) {
    console.error("/api/auth/login error:", err);
    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}

