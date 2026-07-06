import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { encrypt, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const users = await sql`SELECT id, username, password_hash FROM users WHERE username = ${username}`;
  const user = users[0] as { id: string; username: string; password_hash: string } | undefined;

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = await encrypt({ userId: user.id, username: user.username });
  const response = NextResponse.json({ success: true });
  setSessionCookie(response, token);

  return response;
}
