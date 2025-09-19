import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { ShoppingCart, MessageSquare, Users, Package, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get comprehensive statistics
  const [ordersResult, messagesResult, clientsResult, productsResult] = await Promise.all([
    supabase.from("orders").select("id, status, product_name, quantity, created_at"),
    supabase.from("messages").select("id, status, request_type"),
    supabase.from("clients").select("id"),
    supabase.from("products").select("id, name"),
  ])

  const orders = ordersResult.data || []
  const messages = messagesResult.data || []
  const clients = clientsResult.data || []
  const products = productsResult.data || []

  // Calculate product statistics
  const productStats = products.map((product) => {
    const productOrders = orders.filter((order) => order.product_name === product.name)
    const totalQuantity = productOrders.reduce((sum, order) => sum + order.quantity, 0)
    return {
      name: product.name,
      orders: productOrders.length,
      quantity: totalQuantity,
    }
  })

  // Sort by most ordered
  productStats.sort((a, b) => b.quantity - a.quantity)

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentOrders = orders.filter((order) => new Date(order.created_at) >= sevenDaysAgo)

  const stats = [
    {
      title: "Ordini Totali",
      value: orders.length,
      description: "Tutti gli ordini ricevuti",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Messaggi",
      value: messages.length,
      description: "Messaggi dal form contatti",
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Clienti",
      value: clients.length,
      description: "Clienti registrati",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Ordini Recenti",
      value: recentOrders.length,
      description: "Ultimi 7 giorni",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analisi Vendite</h1>
        <p className="text-gray-600">Panoramica delle vendite e statistiche dettagliate</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Ordini per Stato</CardTitle>
            <CardDescription>Distribuzione degli ordini per stato</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Appena ordinato", "Pagato", "Consegnato"].map((status) => {
                const count = orders.filter((o) => o.status === status).length
                const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{status}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 w-12">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Messages by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Messaggi per Tipo</CardTitle>
            <CardDescription>Distribuzione dei messaggi per categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Informazioni generali", "Ordini e consegna", "Collaborazioni", "Visita in azienda", "Altro"].map(
                (type) => {
                  const count = messages.filter((m) => m.request_type === type).length
                  const percentage = messages.length > 0 ? (count / messages.length) * 100 : 0
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Prodotti più Venduti
            </CardTitle>
            <CardDescription>Classifica dei prodotti per quantità venduta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productStats.slice(0, 10).map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{product.orders} ordini</span>
                    <span className="text-sm font-medium">{product.quantity} pz</span>
                  </div>
                </div>
              ))}
              {productStats.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Nessun dato di vendita disponibile</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
