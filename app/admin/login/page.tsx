"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLogin() {
  const [email, setEmail] = useState("oliodivaleria@server.com") // Pre-fill email for testing
  const [password, setPassword] = useState("662002") // Pre-fill password for testing
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Set admin token cookie
      document.cookie = `admin-token=${data.token}; path=/; max-age=86400; secure; samesite=strict`

      router.push("/admin/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const testAuth = async () => {
    try {
      const response = await fetch("/api/admin/test-auth")
      const data = await response.json()
      console.log("[v0] Auth test result:", data)

      if (data.error) {
        setError(`Test failed: ${data.error}. ${data.suggestion || ""}`)
      } else {
        setError(`Test passed: ${data.message}. Password test: ${data.passwordTest}`)
      }
    } catch (error) {
      setError("Test request failed")
    }
  }

  const fixPassword = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/fix-password", {
        method: "POST",
      })
      const data = await response.json()

      if (data.error) {
        setError(`Fix failed: ${data.error}`)
      } else {
        setError(`Password fixed successfully! Hash test: ${data.hashTest}`)
      }
    } catch (error) {
      setError("Fix request failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="w-full max-w-sm">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-800">Admin Login</CardTitle>
            <CardDescription className="text-green-600">Accesso amministratore Olio di Valeria</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="oliodivaleria@server.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="button" variant="outline" onClick={testAuth} className="w-full bg-transparent">
                  Test Authentication
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={fixPassword}
                  className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                >
                  Fix Password Hash
                </Button>

                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
                  {isLoading ? "Accesso in corso..." : "Accedi"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
