import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendNewMessageNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { name, email, request_type, message } = await request.json()

    // Validate required fields
    if (!name || !email || !request_type || !message) {
      return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 })
    }

    // Validate request_type
    const validTypes = ["Informazioni generali", "Ordini e consegna", "Collaborazioni", "Visita in azienda", "Altro"]
    if (!validTypes.includes(request_type)) {
      return NextResponse.json({ error: "Tipo di richiesta non valido" }, { status: 400 })
    }

    const messageData = {
      name,
      email,
      request_type,
      message,
      status: "Nuovo",
    }

    // Insert message
    const { data: newMessage, error: messageError } = await supabase
      .from("messages")
      .insert([messageData])
      .select()
      .single()

    if (messageError) {
      console.error("Database error:", messageError)
      return NextResponse.json({ error: "Errore nell'invio del messaggio" }, { status: 500 })
    }

    // Add/update client
    await supabase.from("clients").upsert(
      {
        email,
        name,
      },
      { onConflict: "email" },
    )

    // Send email notification
    try {
      await sendNewMessageNotification(messageData)
    } catch (emailError) {
      console.error("Email notification failed:", emailError)
      // Don't fail the message creation if email fails
    }

    return NextResponse.json({
      message: "Messaggio inviato con successo",
      id: newMessage.id,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}
