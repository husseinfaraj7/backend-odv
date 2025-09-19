import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendNewOrderNotification } from "@/lib/email"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: orders, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Errore nel recupero degli ordini" }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const orderData = await request.json()

    // Insert order
    const { data: order, error: orderError } = await supabase.from("orders").insert([orderData]).select().single()

    if (orderError) {
      console.error("Database error:", orderError)
      return NextResponse.json({ error: "Errore nella creazione dell'ordine" }, { status: 500 })
    }

    // Add/update client
    await supabase.from("clients").upsert(
      {
        email: orderData.customer_email,
        phone: orderData.customer_phone,
        name: orderData.customer_name,
      },
      { onConflict: "email" },
    )

    try {
      await sendNewOrderNotification(orderData)
    } catch (emailError) {
      console.error("Email notification failed:", emailError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}
