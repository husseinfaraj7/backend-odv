import nodemailer from "nodemailer"
import { createClient } from "@/lib/supabase/server"

// Email configuration
const createTransporter = () => {
  // For production, you would use a real SMTP service like SendGrid, Mailgun, etc.
  // For now, we'll create a basic configuration that can be easily adapted
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your email
      pass: process.env.SMTP_PASS, // Your email password or app password
    },
  })
}

export async function sendNewOrderNotification(orderData: any) {
  try {
    const supabase = await createClient()

    // Get admin notification email
    const { data: admin } = await supabase.from("admin_users").select("notification_email").single()

    if (!admin?.notification_email) {
      console.error("No notification email configured")
      return false
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: admin.notification_email,
      subject: "🛒 Nuovo Ordine - Olio di Valeria",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
            <h1>🫒 Nuovo Ordine Ricevuto</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Dettagli Cliente</h2>
            <p><strong>Nome:</strong> ${orderData.customer_name}</p>
            <p><strong>Email:</strong> ${orderData.customer_email}</p>
            ${orderData.customer_phone ? `<p><strong>Telefono:</strong> ${orderData.customer_phone}</p>` : ""}
            
            <h2>Dettagli Ordine</h2>
            <p><strong>Prodotto:</strong> ${orderData.product_name}</p>
            <p><strong>Formato:</strong> ${orderData.product_size}</p>
            <p><strong>Quantità:</strong> ${orderData.quantity}</p>
            <p><strong>Stato:</strong> ${orderData.status}</p>
            ${orderData.notes ? `<p><strong>Note:</strong> ${orderData.notes}</p>` : ""}
            
            <div style="margin-top: 20px; padding: 15px; background-color: #dcfce7; border-left: 4px solid #16a34a;">
              <p style="margin: 0;"><strong>Data ordine:</strong> ${new Date().toLocaleString("it-IT")}</p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background-color: #e5e7eb; color: #6b7280;">
            <p>Questo è un messaggio automatico dal sistema di gestione ordini Olio di Valeria.</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending order notification:", error)
    return false
  }
}

export async function sendNewMessageNotification(messageData: any) {
  try {
    const supabase = await createClient()

    // Get admin notification email
    const { data: admin } = await supabase.from("admin_users").select("notification_email").single()

    if (!admin?.notification_email) {
      console.error("No notification email configured")
      return false
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: admin.notification_email,
      subject: "💬 Nuovo Messaggio - Olio di Valeria",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1>💬 Nuovo Messaggio dal Form Contatti</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Dettagli Mittente</h2>
            <p><strong>Nome:</strong> ${messageData.name}</p>
            <p><strong>Email:</strong> ${messageData.email}</p>
            <p><strong>Tipo di richiesta:</strong> ${messageData.request_type}</p>
            
            <h2>Messaggio</h2>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
              <p style="margin: 0; white-space: pre-wrap;">${messageData.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-left: 4px solid #2563eb;">
              <p style="margin: 0;"><strong>Data messaggio:</strong> ${new Date().toLocaleString("it-IT")}</p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background-color: #e5e7eb; color: #6b7280;">
            <p>Questo è un messaggio automatico dal sistema di gestione contatti Olio di Valeria.</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending message notification:", error)
    return false
  }
}
