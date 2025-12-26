import { NextResponse } from "next/server"

// mock database (อยู่ใน memory)
let appointments = []

/* ===================== GET ===================== */
// - /api/appointments        → list
// - /api/appointments?id=xx  → detail
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (id) {
    const item = appointments.find(a => String(a.id) === id)
    return NextResponse.json(item || null)
  }

  return NextResponse.json(appointments)
}

/* ===================== POST (ADD) ===================== */
export async function POST(req) {
  const body = await req.json()

  const item = {
    id: Date.now(),
    ...body,
    location:
      body.program === "Onsite"
        ? body.location?.trim() || "-"
        : "-",
    status: body.status || "pending",
  }

  appointments.unshift(item)
  return NextResponse.json({ success: true, item })
}

/* ===================== PUT (EDIT) ===================== */
export async function PUT(req) {
  const body = await req.json()

  if (!body.id) {
    return NextResponse.json(
      { success: false, message: "Missing id" },
      { status: 400 }
    )
  }

  appointments = appointments.map(a =>
    a.id === body.id
      ? {
          ...a,
          ...body,
          location:
            body.program === "Onsite"
              ? body.location?.trim() || "-"
              : "-",
        }
      : a
  )

  return NextResponse.json({ success: true })
}

/* ===================== DELETE ===================== */
export async function DELETE(req) {
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get("id"))

  appointments = appointments.filter(a => a.id !== id)
  return NextResponse.json({ success: true })
}
