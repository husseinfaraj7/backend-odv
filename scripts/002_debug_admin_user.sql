-- Debug script to check admin user
SELECT 
  id,
  email,
  password_hash,
  notification_email,
  created_at
FROM admin_users 
WHERE email = 'oliodivaleria@server.com';
