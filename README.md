# Olio di Valeria - Backend System

Sistema di gestione backend completo per Olio di Valeria, sviluppato con Next.js, Supabase e TypeScript.

## 🌟 Caratteristiche

### Autenticazione Admin
- Utente amministratore fisso con credenziali sicure
- Sistema di autenticazione JWT
- Middleware di protezione per le route admin

### Dashboard Amministratore
- **Analisi Vendite**: Statistiche dettagliate e performance prodotti
- **Gestione Ordini**: CRUD completo con stati personalizzabili
- **Gestione Messaggi**: Sistema di gestione contatti con filtri
- **Database Clienti**: Gestione email e telefoni clienti
- **Impostazioni**: Configurazione password e email notifiche

### API Endpoints Pubblici
- `POST /api/orders` - Creazione ordini dal frontend
- `POST /api/contact` - Invio messaggi dal form contatti
- `GET /api/orders` - Lista prodotti disponibili

### Sistema di Notifiche
- Email automatiche per nuovi ordini
- Email automatiche per nuovi messaggi
- Configurazione SMTP personalizzabile

## 🚀 Installazione e Setup

### 1. Clona il Repository
\`\`\`bash
git clone <repository-url>
cd olio-di-valeria-backend
\`\`\`

### 2. Installa le Dipendenze
\`\`\`bash
npm install
\`\`\`

### 3. Configura le Variabili d'Ambiente
Crea un file `.env.local` con le seguenti variabili:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Development Redirect URL
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/admin/dashboard
\`\`\`

### 4. Setup Database
Il sistema creerà automaticamente le tabelle necessarie al primo avvio. Le tabelle includono:
- `admin_users` - Utenti amministratori
- `products` - Catalogo prodotti
- `orders` - Ordini clienti
- `messages` - Messaggi dal form contatti
- `clients` - Database clienti

### 5. Avvia il Server di Sviluppo
\`\`\`bash
npm run dev
\`\`\`

Il sistema sarà disponibile su `http://localhost:3000`

## 📋 Credenziali Admin Default

- **Email**: `oliodivaleria@server.com`
- **Password**: `662002`

⚠️ **Importante**: Cambia la password dopo il primo accesso dalle Impostazioni.

## 🛍️ Prodotti Configurati

Il sistema include i seguenti prodotti con i rispettivi formati:

- **Quadra**: 250ml, 0.5l
- **King Quadra**: 0.5l
- **Grandolio**: 250ml, 0.5l, 0.75l
- **Olea**: 0.25l, 0.5l
- **Oliena**: 0.25l, 0.5l
- **Marasca**: 1l
- **Latta**: 3l, 5l
- **Confezioni regalo**: 2, 3, 4, 6 bottiglie
- **Spray**: 100ml
- **Testa di Moro**: femminile, maschile

## 📧 Configurazione Email

Per abilitare le notifiche email:

1. Configura un account SMTP (Gmail, SendGrid, Mailgun, etc.)
2. Aggiungi le credenziali SMTP nel file `.env.local`
3. Per Gmail, usa una "App Password" invece della password normale
4. Configura l'email di notifica nelle Impostazioni admin

## 🔧 Stati Sistema

### Stati Ordini
- **Appena ordinato** (default)
- **Pagato**
- **Consegnato**

### Stati Messaggi
- **Nuovo** (default)
- **Non letto**
- **Letto**

### Tipi Richiesta Messaggi
- Informazioni generali
- Ordini e consegna
- Collaborazioni
- Visita in azienda
- Altro

## 🚀 Deploy in Produzione

### Render.com (Raccomandato per questo progetto)

#### Opzione 1: Deploy con render.yaml (Automatico)
1. **Connetti Repository**:
   - Vai su [render.com](https://render.com)
   - Crea un account e connetti il tuo repository GitHub
   - Render rileverà automaticamente il file `render.yaml`

2. **Configura Variabili d'Ambiente**:
   Nel dashboard Render, aggiungi le seguenti variabili:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_jwt_secret_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   \`\`\`

3. **Deploy**: Render farà il deploy automaticamente

#### Opzione 2: Deploy Manuale
1. **Crea Web Service**:
   - Vai su Render Dashboard
   - Clicca "New" → "Web Service"
   - Connetti il repository

2. **Configurazione Build**:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18+

3. **Aggiungi Variabili d'Ambiente** (come sopra)

4. **Deploy**: Clicca "Create Web Service"

#### Post-Deploy Setup
1. **Inizializza Database**:
   - Vai su `https://your-app.onrender.com/admin/login`
   - Clicca "Fix Password Hash" per inizializzare l'admin
   - Usa le credenziali: `oliodivaleria@server.com` / `662002`

2. **Test Funzionalità**:
   - Testa il login admin
   - Verifica le API endpoints
   - Controlla le notifiche email

### Vercel
1. Connetti il repository a Vercel
2. Configura le variabili d'ambiente nel dashboard Vercel
3. Deploy automatico ad ogni push

### Railway
1. Connetti il repository a Railway
2. Configura le variabili d'ambiente
3. Deploy automatico

## 📁 Struttura del Progetto

\`\`\`
├── app/
│   ├── admin/           # Dashboard amministratore
│   │   ├── dashboard/   # Analisi vendite
│   │   ├── orders/      # Gestione ordini
│   │   ├── messages/    # Gestione messaggi
│   │   ├── clients/     # Database clienti
│   │   ├── settings/    # Impostazioni admin
│   │   └── login/       # Login admin
│   ├── api/             # API endpoints
│   │   ├── admin/       # API admin protette
│   │   ├── orders/      # API ordini pubbliche
│   │   └── contact/     # API contatti pubbliche
│   └── page.tsx         # Homepage informativa
├── components/
│   ├── admin/           # Componenti admin
│   └── ui/              # Componenti UI base
├── lib/
│   ├── supabase/        # Client Supabase
│   ├── auth.ts          # Sistema autenticazione
│   └── email.ts         # Sistema notifiche email
├── scripts/
│   └── 001_create_tables.sql  # Schema database
├── render.yaml          # Configurazione Render.com
└── Dockerfile          # Container configuration
\`\`\`

## 🔒 Sicurezza

- Password hashate con bcrypt
- Autenticazione JWT con scadenza
- Middleware di protezione route admin
- Validazione input lato server
- Sanitizzazione dati database

## 🐛 Troubleshooting

### Problemi Comuni su Render.com

1. **Build Fails**:
   - Verifica che Node.js sia versione 18+
   - Controlla che tutte le dipendenze siano installate
   - Verifica il comando build: `npm ci && npm run build`

2. **App Non Si Avvia**:
   - Controlla le variabili d'ambiente
   - Verifica il comando start: `npm start`
   - Controlla i log di Render per errori

3. **Database Connection Error**:
   - Verifica le credenziali Supabase
   - Controlla che le variabili d'ambiente siano configurate correttamente
   - Testa la connessione dal pannello admin

4. **Email Non Funzionano**:
   - Verifica le credenziali SMTP
   - Per Gmail, usa App Password invece della password normale
   - Controlla che SMTP_PORT sia 587

## 📞 Supporto

Per supporto tecnico o domande:
- Controlla la documentazione
- Verifica le variabili d'ambiente
- Controlla i log del server per errori
- Usa il pannello "Test Authentication" per diagnosticare problemi

## 📄 Licenza

Questo progetto è sviluppato specificamente per Olio di Valeria.
