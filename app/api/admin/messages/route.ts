import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendNewMessageNotification } from "@/lib/email"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Errore nel recupero dei messaggi" }, { status: 500 })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const messageData = await request.json()

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert([messageData])
      .select()
      .single()

    if (messageError) {
      console.error("Database error:", messageError)
      return NextResponse.json({ error: "Errore nella creazione del messaggio" }, { status: 500 })
    }

    // Add/update client
    await supabase.from("clients").upsert(
      {
        email: messageData.email,
        name: messageData.name,
      },
      { onConflict: "email" },
    )

    try {
      await sendNewMessageNotification(messageData)
    } catch (emailError) {
      console.error("Email notification failed:", emailError)
      // Don't fail the message creation if email fails
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}
