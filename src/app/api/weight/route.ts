import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    SELECT id, date, weight_kg, notes, created_at
    FROM weight_entries
    WHERE user_id = ${session.userId}
    ORDER BY date DESC
    LIMIT 100
  `;

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.date || !body.weight_kg) {
    return NextResponse.json(
      { error: "date and weight_kg are required" },
      { status: 400 },
    );
  }

  const rows = await sql`
    INSERT INTO weight_entries (user_id, date, weight_kg, notes)
    VALUES (${session.userId}, ${body.date}, ${parseFloat(body.weight_kg)}, ${body.notes || ""})
    RETURNING id, date, weight_kg, notes, created_at
  `;

  return NextResponse.json(rows[0], { status: 201 });
}
