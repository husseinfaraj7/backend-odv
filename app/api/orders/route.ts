import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendNewOrderNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const orderData = await request.json()

    // Validate required fields
    const { customer_name, customer_email, product_name, product_size, quantity } = orderData

    if (!customer_name || !customer_email || !product_name || !product_size || !quantity) {
      return NextResponse.json({ error: "Tutti i campi obbligatori devono essere compilati" }, { status: 400 })
    }

    // Validate product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("name", product_name)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: "Prodotto non valido" }, { status: 400 })
    }

    // Validate product size
    if (!product.sizes.includes(product_size)) {
      return NextResponse.json({ error: "Formato prodotto non valido" }, { status: 400 })
    }

    // Set default values
    const completeOrderData = {
      customer_name,
      customer_email,
      customer_phone: orderData.customer_phone || null,
      product_name,
      product_size,
      quantity: Number.parseInt(quantity) || 1,
      status: "Appena ordinato",
      notes: orderData.notes || null,
    }

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([completeOrderData])
      .select()
      .single()

    if (orderError) {
      console.error("Database error:", orderError)
      return NextResponse.json({ error: "Errore nella creazione dell'ordine" }, { status: 500 })
    }

    // Add/update client
    await supabase.from("clients").upsert(
      {
        email: customer_email,
        phone: orderData.customer_phone,
        name: customer_name,
      },
      { onConflict: "email" },
    )

    // Send email notification
    try {
      await sendNewOrderNotification(completeOrderData)
    } catch (emailError) {
      console.error("Email notification failed:", emailError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      message: "Ordine creato con successo",
      order_id: order.id,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 })
  }
}

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
