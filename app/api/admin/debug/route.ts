import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if admin user exists
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", "oliodivaleria@server.com")
      .single()

    if (error) {
      console.log("[v0] Admin user query error:", error)
      return NextResponse.json(
        {
          error: "Admin user not found",
          details: error.message,
        },
        { status: 404 },
      )
    }

    // Test password hash
    const testPassword = "662002"
    const isValidPassword = await bcrypt.compare(testPassword, admin.password_hash)

    console.log("[v0] Admin user found:", {
      id: admin.id,
      email: admin.email,
      passwordValid: isValidPassword,
    })

    return NextResponse.json({
      adminExists: true,
      email: admin.email,
      passwordValid: isValidPassword,
      createdAt: admin.created_at,
    })
  } catch (error) {
    console.error("[v0] Debug error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
