import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { encrypt, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = await sql`SELECT id FROM users WHERE username = ${username}`;
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { rows } = await sql`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id, username
  `;

  const user = rows[0];
  const token = await encrypt({ userId: user.id, username: user.username });
  const response = NextResponse.json({ success: true });
  setSessionCookie(response, token);

  return response;
}
