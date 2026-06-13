import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { mysqlPool } from "@/lib/mysql";

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

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existing = await mysqlPool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [emailRaw]
    );

    if (Array.isArray(existing[0]) && existing[0].length > 0) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await mysqlPool.query(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [emailRaw, passwordHash]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/auth/signup error:", err);
    return NextResponse.json(
      { error: "Signup failed." },
      { status: 500 }
    );
  }
}

