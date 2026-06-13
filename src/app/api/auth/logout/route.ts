import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mysqlPool } from "@/lib/mysql";

const SESSION_COOKIE_NAME = "wallip_session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;


    if (token) {
      await mysqlPool.query("DELETE FROM user_sessions WHERE session_token = ?", [token]);
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0),
    });

    return res;
  } catch (err) {
    console.error("/api/auth/logout error:", err);
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}

