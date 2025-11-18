-- Migration 002: Add Development User
-- This creates a test user for development mode

-- Insert dev user (if not exists)
INSERT INTO studypro_users (
  id,
  email,
  full_name,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'dev@studypro.test',
  'Dev User',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify the user was created
SELECT * FROM studypro_users WHERE id = '00000000-0000-0000-0000-000000000001';
