import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: clients, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Errore nel recupero dei clienti" }, { status: 500 })
    }

    return NextResponse.json({ clients })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const clientData = await request.json()

    const { data: client, error } = await supabase.from("clients").insert([clientData]).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Errore nella creazione del cliente" }, { status: 500 })
    }

    return NextResponse.json({ client })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}
