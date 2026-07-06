import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    SELECT id, date, waist_cm, hip_cm, chest_cm, thigh_cm, arm_cm, notes
    FROM body_measurements
    WHERE user_id = ${session.userId}
    ORDER BY date DESC
  `;

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, waist_cm, hip_cm, chest_cm, thigh_cm, arm_cm, notes } = await request.json();

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO body_measurements (user_id, date, waist_cm, hip_cm, chest_cm, thigh_cm, arm_cm, notes)
    VALUES (${session.userId}, ${date}, ${waist_cm ?? null}, ${hip_cm ?? null}, ${chest_cm ?? null}, ${thigh_cm ?? null}, ${arm_cm ?? null}, ${notes ?? ""})
    RETURNING id
  `;

  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}
