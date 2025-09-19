import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const supabase = await createClient()

    console.log("[v0] Testing database connection...")

    // Check if admin_users table exists and get admin user
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", "oliodivaleria@server.com")
      .single()

    if (error) {
      console.log("[v0] Database error:", error.message)
      return NextResponse.json(
        {
          error: "Database error",
          details: error.message,
          suggestion: "Make sure to run the database script first",
        },
        { status: 500 },
      )
    }

    if (!admin) {
      return NextResponse.json(
        {
          error: "Admin user not found",
          suggestion: "Run the database script to create the admin user",
        },
        { status: 404 },
      )
    }

    // Test password hash
    const testPassword = "662002"
    const isValidPassword = await bcrypt.compare(testPassword, admin.password_hash)

    console.log("[v0] Admin user found:", admin.email)
    console.log("[v0] Password hash test:", isValidPassword)

    return NextResponse.json({
      message: "Authentication test successful",
      admin: {
        id: admin.id,
        email: admin.email,
        created_at: admin.created_at,
        notification_email: admin.notification_email,
      },
      passwordTest: isValidPassword,
      suggestion: isValidPassword ? "Login should work with these credentials" : "Password hash might be incorrect",
    })
  } catch (error) {
    console.error("[v0] Test error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
