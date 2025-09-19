import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const supabase = await createClient()

    // Generate new hash for password "662002"
    const password = "662002"
    const saltRounds = 10
    const newHash = await bcrypt.hash(password, saltRounds)

    console.log("[v0] Generated new password hash")

    // Update the admin user with the new hash
    const { data, error } = await supabase
      .from("admin_users")
      .update({ password_hash: newHash })
      .eq("email", "oliodivaleria@server.com")
      .select()

    if (error) {
      console.log("[v0] Update error:", error.message)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    // Test the new hash
    const isValid = await bcrypt.compare(password, newHash)

    console.log("[v0] Password hash updated and tested:", isValid)

    return NextResponse.json({
      message: "Password hash fixed successfully",
      hashTest: isValid,
      admin: data?.[0],
    })
  } catch (error) {
    console.error("[v0] Fix password error:", error)
    return NextResponse.json(
      { error: "Failed to fix password", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
