import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createClient } from "@/lib/supabase/server"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function authenticateAdmin(email: string, password: string) {
  const supabase = await createClient()

  console.log("[v0] Authenticating admin:", email)

  const { data: admin, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

  if (error || !admin) {
    console.log("[v0] Admin not found or error:", error?.message)
    return null
  }

  console.log("[v0] Admin found, checking password")

  const isValidPassword = await bcrypt.compare(password, admin.password_hash)

  console.log("[v0] Password valid:", isValidPassword)

  if (!isValidPassword) {
    return null
  }

  // Generate JWT token
  const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "24h" })

  return { admin, token }
}

export async function verifyAdminToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

export async function updateAdminPassword(adminId: string, newPassword: string) {
  const supabase = await createClient()
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  const { error } = await supabase
    .from("admin_users")
    .update({ password_hash: hashedPassword, updated_at: new Date().toISOString() })
    .eq("id", adminId)

  return !error
}

export async function updateNotificationEmail(adminId: string, email: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("admin_users")
    .update({ notification_email: email, updated_at: new Date().toISOString() })
    .eq("id", adminId)

  return !error
}
