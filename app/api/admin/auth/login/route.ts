import { type NextRequest, NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email e password sono richiesti" }, { status: 400 })
    }

    const result = await authenticateAdmin(email, password)

    if (!result) {
      console.log("[v0] Authentication failed for:", email)
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 })
    }

    console.log("[v0] Authentication successful for:", email)

    return NextResponse.json({
      message: "Login successful",
      token: result.token,
      admin: {
        id: result.admin.id,
        email: result.admin.email,
        notification_email: result.admin.notification_email,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}
