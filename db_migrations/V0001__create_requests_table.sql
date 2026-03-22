CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  comment TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  admin_reply TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);