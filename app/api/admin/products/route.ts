import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: products, error } = await supabase.from("products").select("*").order("name")

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Errore nel recupero dei prodotti" }, { status: 500 })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}
