import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // For now, we'll get the first admin user (since there's only one)
    const { data: admin, error } = await supabase.from("admin_users").select("id, email, notification_email").single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Errore nel recupero delle impostazioni" }, { status: 500 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}
