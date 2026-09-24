/* Run this file in your PostgreSQL database (e.g., using psql or Postico)
  to set up the required tables.
*/

-- Create a custom type for user roles, as required by FAQ-F-004 [cite: 638]
CREATE TYPE user_role AS ENUM ('Administrator', 'Editor');

-- Create the users table
-- Implements FAQ-F-001 (login) and FAQ-F-002 (hashed password) [cite: 638]
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'Editor',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the categories table
-- Implements FAQ-F-014 (manage categories) [cite: 642]
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- Create the main faqs table
-- Implements FAQ-F-010 (create FAQ) [cite: 641]
CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL, -- The rich-text editor [cite: 641] will save HTML here
  category_id INT REFERENCES categories(id) ON DELETE SET NULL, -- Handle category deletion [cite: 642]
  created_by INT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for full-text search (for the Search Service)
-- This prepares us for requirement FAQ-F-020 [cite: 645] and mitigates Risk 1 [cite: 88]
CREATE INDEX idx_faqs_search ON faqs USING gin(to_tsvector('english', question || ' ' || answer));
