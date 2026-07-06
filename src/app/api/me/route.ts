import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    SELECT username, height_cm, goal_weight_kg, unit_preference FROM users WHERE id = ${session.userId}
  `;
  const user = rows[0] as {
    username: string;
    height_cm: number | null;
    goal_weight_kg: number | null;
    unit_preference: string;
  } | undefined;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    username: user.username,
    height_cm: user.height_cm,
    goal_weight_kg: user.goal_weight_kg,
    unit_preference: user.unit_preference,
  });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if ("height_cm" in body) {
    const { height_cm } = body;
    if (height_cm !== null && (typeof height_cm !== "number" || height_cm < 50 || height_cm > 300)) {
      return NextResponse.json({ error: "Height must be between 50 and 300 cm" }, { status: 400 });
    }
    await sql`UPDATE users SET height_cm = ${height_cm} WHERE id = ${session.userId}`;
    return NextResponse.json({ success: true });
  }

  if ("goal_weight_kg" in body) {
    const { goal_weight_kg } = body;
    if (goal_weight_kg !== null && (typeof goal_weight_kg !== "number" || goal_weight_kg < 20 || goal_weight_kg > 500)) {
      return NextResponse.json({ error: "Goal weight must be between 20 and 500 kg" }, { status: 400 });
    }
    await sql`UPDATE users SET goal_weight_kg = ${goal_weight_kg} WHERE id = ${session.userId}`;
    return NextResponse.json({ success: true });
  }

  if ("unit_preference" in body) {
    const { unit_preference } = body;
    if (!["kg", "lbs"].includes(unit_preference)) {
      return NextResponse.json({ error: "Unit must be kg or lbs" }, { status: 400 });
    }
    await sql`UPDATE users SET unit_preference = ${unit_preference} WHERE id = ${session.userId}`;
    return NextResponse.json({ success: true });
  }

  if ("current_password" in body) {
    const { current_password, new_password } = body;
    if (!current_password || !new_password || new_password.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    const rows = await sql`
      SELECT password_hash FROM users WHERE id = ${session.userId}
    `;
    const user = rows[0] as { password_hash: string } | undefined;
    if (!user || !(await bcrypt.compare(current_password, user.password_hash))) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    await sql`UPDATE users SET password_hash = ${password_hash} WHERE id = ${session.userId}`;
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}
