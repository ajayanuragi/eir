import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    SELECT username, height_cm FROM users WHERE id = ${session.userId}
  `;
  const user = rows[0] as { username: string; height_cm: number | null } | undefined;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ username: user.username, height_cm: user.height_cm });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { height_cm } = await request.json();

  if (height_cm !== null && (typeof height_cm !== "number" || height_cm < 50 || height_cm > 300)) {
    return NextResponse.json({ error: "Height must be between 50 and 300 cm" }, { status: 400 });
  }

  await sql`UPDATE users SET height_cm = ${height_cm} WHERE id = ${session.userId}`;

  return NextResponse.json({ success: true });
}
