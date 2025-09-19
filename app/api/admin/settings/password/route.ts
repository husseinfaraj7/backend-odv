import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Password attuale e nuova password sono richieste" }, { status: 400 })
    }

    // Get current admin user
    const { data: admin, error: fetchError } = await supabase.from("admin_users").select("*").single()

    if (fetchError || !admin) {
      return NextResponse.json({ error: "Amministratore non trovato" }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Password attuale non corretta" }, { status: 401 })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({
        password_hash: hashedNewPassword,
        updated_at: new Date().toISOString(),
      })
      .eq("id", admin.id)

    if (updateError) {
      console.error("Database error:", updateError)
      return NextResponse.json({ error: "Errore nell'aggiornamento della password" }, { status: 500 })
    }

    return NextResponse.json({ message: "Password aggiornata con successo" })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}
