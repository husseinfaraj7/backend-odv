import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { notificationEmail } = await request.json()

    if (!notificationEmail) {
      return NextResponse.json({ error: "Email di notifica è richiesta" }, { status: 400 })
    }

    // Get current admin user
    const { data: admin, error: fetchError } = await supabase.from("admin_users").select("id").single()

    if (fetchError || !admin) {
      return NextResponse.json({ error: "Amministratore non trovato" }, { status: 404 })
    }

    // Update notification email
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({
        notification_email: notificationEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", admin.id)

    if (updateError) {
      console.error("Database error:", updateError)
      return NextResponse.json({ error: "Errore nell'aggiornamento dell'email" }, { status: 500 })
    }

    return NextResponse.json({ message: "Email di notifica aggiornata con successo" })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}
