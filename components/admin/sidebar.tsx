"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingCart, MessageSquare, Users, Settings, LogOut, Leaf } from "lucide-react"

const navigation = [
  { name: "Analisi vendite", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Ordini", href: "/admin/orders", icon: ShoppingCart },
  { name: "Messaggi", href: "/admin/messages", icon: MessageSquare },
  { name: "Clienti", href: "/admin/clients", icon: Users },
  { name: "Impostazioni", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Clear admin token
    document.cookie = "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/login")
  }

  return (
    <div className="flex h-full w-64 flex-col bg-green-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-2 p-6 border-b border-green-800">
        <Leaf className="h-8 w-8 text-yellow-400" />
        <div>
          <h1 className="text-xl font-bold">Olio di Valeria</h1>
          <p className="text-sm text-green-300">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-green-800",
                    pathname === item.href ? "bg-green-800 text-yellow-400" : "text-green-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-green-800">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-green-100 hover:bg-green-800 hover:text-white"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Esci
        </Button>
      </div>
    </div>
  )
}
