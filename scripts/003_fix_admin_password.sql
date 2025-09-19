-- Fix admin password hash for password "662002"
-- This script regenerates the correct bcrypt hash
UPDATE admin_users 
SET password_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'oliodivaleria@server.com';

-- Verify the update
SELECT email, password_hash FROM admin_users WHERE email = 'oliodivaleria@server.com';
