"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, Calendar, Mail, User, Filter } from "lucide-react"

interface Message {
  id: string
  name: string
  email: string
  request_type: "Informazioni generali" | "Ordini e consegna" | "Collaborazioni" | "Visita in azienda" | "Altro"
  message: string
  status: "Nuovo" | "Non letto" | "Letto"
  created_at: string
  updated_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, statusFilter, typeFilter])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/messages")
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterMessages = () => {
    let filtered = messages

    if (statusFilter !== "all") {
      filtered = filtered.filter((msg) => msg.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((msg) => msg.request_type === typeFilter)
    }

    setFilteredMessages(filtered)
  }

  const handleStatusUpdate = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const openMessageDialog = async (message: Message) => {
    setSelectedMessage(message)
    setIsDialogOpen(true)

    // Mark as read if it's new or unread
    if (message.status === "Nuovo" || message.status === "Non letto") {
      await handleStatusUpdate(message.id, "Letto")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nuovo":
        return "bg-red-100 text-red-800"
      case "Non letto":
        return "bg-yellow-100 text-yellow-800"
      case "Letto":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Informazioni generali":
        return "bg-blue-100 text-blue-800"
      case "Ordini e consegna":
        return "bg-green-100 text-green-800"
      case "Collaborazioni":
        return "bg-purple-100 text-purple-800"
      case "Visita in azienda":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestione Messaggi</h1>
          <p className="text-gray-600">Visualizza e gestisci i messaggi dal form contatti</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtra per stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              <SelectItem value="Nuovo">Nuovo</SelectItem>
              <SelectItem value="Non letto">Non letto</SelectItem>
              <SelectItem value="Letto">Letto</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtra per tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i tipi</SelectItem>
              <SelectItem value="Informazioni generali">Informazioni generali</SelectItem>
              <SelectItem value="Ordini e consegna">Ordini e consegna</SelectItem>
              <SelectItem value="Collaborazioni">Collaborazioni</SelectItem>
              <SelectItem value="Visita in azienda">Visita in azienda</SelectItem>
              <SelectItem value="Altro">Altro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nessun messaggio</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {messages.length === 0
                    ? "Non ci sono messaggi da visualizzare."
                    : "Nessun messaggio corrisponde ai filtri selezionati."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader onClick={() => openMessageDialog(message)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {message.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(message.created_at).toLocaleDateString("it-IT")}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(message.request_type)}>{message.request_type}</Badge>
                    <Badge className={getStatusColor(message.status)}>{message.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent onClick={() => openMessageDialog(message)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                  </div>
                  <div className="ml-4">
                    <Select
                      value={message.status}
                      onValueChange={(value) => handleStatusUpdate(message.id, value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nuovo">Nuovo</SelectItem>
                        <SelectItem value="Non letto">Non letto</SelectItem>
                        <SelectItem value="Letto">Letto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messaggio da {selectedMessage?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedMessage?.email} •{" "}
              {selectedMessage && new Date(selectedMessage.created_at).toLocaleDateString("it-IT")}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getTypeColor(selectedMessage.request_type)}>{selectedMessage.request_type}</Badge>
                <Badge className={getStatusColor(selectedMessage.status)}>{selectedMessage.status}</Badge>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Messaggio:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Ricevuto il {new Date(selectedMessage.created_at).toLocaleString("it-IT")}
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedMessage.status}
                    onValueChange={(value) => handleStatusUpdate(selectedMessage.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nuovo">Nuovo</SelectItem>
                      <SelectItem value="Non letto">Non letto</SelectItem>
                      <SelectItem value="Letto">Letto</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Chiudi
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
