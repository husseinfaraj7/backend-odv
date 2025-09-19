"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Mail, Lock, Save } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Email form
  const [emailForm, setEmailForm] = useState({
    notificationEmail: "",
  })

  useEffect(() => {
    fetchAdminSettings()
  }, [])

  const fetchAdminSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      if (data.admin) {
        setEmailForm({ notificationEmail: data.admin.notification_email })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Le nuove password non corrispondono" })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Password aggiornata con successo" })
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        setMessage({ type: "error", text: data.error || "Errore nell'aggiornamento della password" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Errore di connessione" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/settings/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationEmail: emailForm.notificationEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Email di notifica aggiornata con successo" })
      } else {
        setMessage({ type: "error", text: data.error || "Errore nell'aggiornamento dell'email" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Errore di connessione" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Impostazioni
        </h1>
        <p className="text-gray-600">Gestisci le impostazioni dell'account amministratore</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Password Update */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Modifica Password
            </CardTitle>
            <CardDescription>Aggiorna la password di accesso all'amministrazione</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Password Attuale</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nuova Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Conferma Nuova Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-green-700 hover:bg-green-800">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Aggiornamento..." : "Aggiorna Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email di Notifica
            </CardTitle>
            <CardDescription>Configura l'email per ricevere notifiche di nuovi ordini e messaggi</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div>
                <Label htmlFor="notificationEmail">Email di Notifica</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={emailForm.notificationEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, notificationEmail: e.target.value })}
                  required
                  placeholder="notifiche@oliodivaleria.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Questa email riceverà le notifiche per nuovi ordini e messaggi dal form contatti
                </p>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-green-700 hover:bg-green-800">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Aggiornamento..." : "Aggiorna Email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
