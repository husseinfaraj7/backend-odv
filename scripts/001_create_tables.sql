-- Create admin users table for fixed admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  notification_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sizes TEXT[] NOT NULL, -- Array of available sizes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  product_name TEXT NOT NULL,
  product_size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Appena ordinato' CHECK (status IN ('Pagato', 'Appena ordinato', 'Consegnato')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table (from contact form)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('Informazioni generali', 'Ordini e consegna', 'Collaborazioni', 'Visita in azienda', 'Altro')),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Nuovo' CHECK (status IN ('Nuovo', 'Non letto', 'Letto')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table (extracted from orders and messages)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: 662002)
-- Password hash for "662002" using bcrypt
INSERT INTO admin_users (email, password_hash, notification_email) 
VALUES (
  'oliodivaleria@server.com',
  '$2b$10$8K1p/a0dClpsedgxkOyrO.Vuw4.Qb2FYWPtOf6WKtxbzg0jLW1jqy',
  'oliodivaleria@server.com'
) ON CONFLICT (email) DO NOTHING;

-- Insert products
INSERT INTO products (name, sizes) VALUES
  ('Quadra', ARRAY['250ml', '0.5l']),
  ('King Quadra', ARRAY['0.5l']),
  ('Grandolio', ARRAY['250ml', '0.5l', '0.75l']),
  ('Olea', ARRAY['0.25l', '0.5l']),
  ('Oliena', ARRAY['0.25l', '0.5l']),
  ('Marasca', ARRAY['1l']),
  ('Latta', ARRAY['3l', '5l']),
  ('Confezioni regalo', ARRAY['2 bottiglie', '3 bottiglie', '4 bottiglie', '6 bottiglie']),
  ('Spray', ARRAY['100ml']),
  ('Testa di Moro', ARRAY['femminile', 'maschile'])
ON CONFLICT DO NOTHING;
