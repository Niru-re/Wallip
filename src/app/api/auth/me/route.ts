import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mysqlPool } from "@/lib/mysql";

const SESSION_COOKIE_NAME = "wallip_session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const [rows] = await mysqlPool.query(
    `SELECT u.id, u.email, s.expires_at
     FROM user_sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.session_token = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [token]
  );

  const typedRows = rows as unknown as Array<{ id: number; email: string; expires_at: Date | string }>;

  if (!typedRows || typedRows.length === 0) {
    return NextResponse.json({ user: null });
  }

  const user = {
    id: typedRows[0].id,
    email: typedRows[0].email,
  };

  return NextResponse.json({ user });
}

