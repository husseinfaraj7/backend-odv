import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, ShoppingCart, MessageSquare, BarChart3, Users, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="h-12 w-12 text-green-700" />
            <h1 className="text-4xl font-bold text-green-900">Olio di Valeria</h1>
          </div>
          <p className="text-xl text-green-700 mb-8">Sistema di Gestione Backend</p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Benvenuto nel sistema di gestione per Olio di Valeria. Accedi all'area amministratore per gestire ordini,
            messaggi, clienti e visualizzare le analisi delle vendite.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Analisi Vendite
              </CardTitle>
              <CardDescription>Visualizza statistiche dettagliate e performance dei prodotti</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Gestione Ordini
              </CardTitle>
              <CardDescription>Gestisci tutti gli ordini con stati personalizzabili</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Messaggi Contatti
              </CardTitle>
              <CardDescription>Visualizza e gestisci i messaggi dal form contatti</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Database Clienti
              </CardTitle>
              <CardDescription>Gestisci email e numeri di telefono dei clienti</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Impostazioni
              </CardTitle>
              <CardDescription>Configura password e email di notifica</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Leaf className="h-5 w-5" />
                Notifiche Email
              </CardTitle>
              <CardDescription className="text-green-700">
                Ricevi notifiche automatiche per nuovi ordini e messaggi
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* API Endpoints Info */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>API Endpoints per Frontend</CardTitle>
            <CardDescription>Endpoint disponibili per l'integrazione con il frontend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Ordini</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">POST /api/orders</code>
                <p className="text-sm text-gray-600 mt-1">Crea un nuovo ordine dal frontend</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Messaggi</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">POST /api/contact</code>
                <p className="text-sm text-gray-600 mt-1">Invia messaggio dal form contatti</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Prodotti</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /api/orders</code>
                <p className="text-sm text-gray-600 mt-1">Ottieni lista prodotti e formati disponibili</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Access */}
        <div className="text-center">
          <Card className="inline-block">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-green-900 mb-4">Accesso Amministratore</h2>
              <p className="text-gray-600 mb-6">Accedi al pannello di controllo per gestire il sistema</p>
              <Link href="/admin/login">
                <Button size="lg" className="bg-green-700 hover:bg-green-800">
                  Accedi all'Admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
