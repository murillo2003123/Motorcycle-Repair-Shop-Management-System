-- ============================================================================
-- Supabase PostgreSQL Migration Schema (Week 11 Task 4: Database Migrations)
-- Project: Motorcycle Repair Shop Management System
-- Team:
--   Alvin Murillo (alvinmurillo2003@gmail.com)          - customers table
--   John Angelo Cabatingan (johnangelocabatingan2003@gmail.com) - repairs table
--   Keanu Dagala (keanudagala2003@gmail.com)            - parts table
-- ============================================================================

-- 1. Customers & Motorcycles Table (Owner: Alvin Murillo)
CREATE TABLE IF NOT EXISTS public.customers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 80),
  phone VARCHAR(15) NOT NULL,
  plate_number VARCHAR(12) NOT NULL UNIQUE,
  motorcycle_model VARCHAR(80) NOT NULL CHECK (char_length(trim(motorcycle_model)) BETWEEN 2 AND 80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Repair Job Orders Table (Owner: John Angelo Cabatingan)
CREATE TABLE IF NOT EXISTS public.repairs (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  issue VARCHAR(200) NOT NULL CHECK (char_length(trim(issue)) BETWEEN 5 AND 200),
  mechanic VARCHAR(60) NOT NULL CHECK (char_length(trim(mechanic)) BETWEEN 2 AND 60),
  labor_cost NUMERIC(10, 2) NOT NULL CHECK (labor_cost BETWEEN 0 AND 100000),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Spare Parts Inventory Table (Owner: Keanu Dagala)
CREATE TABLE IF NOT EXISTS public.parts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 100),
  sku VARCHAR(20) NOT NULL UNIQUE,
  qty INTEGER NOT NULL CHECK (qty BETWEEN 0 AND 999),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price BETWEEN 1 AND 100000),
  category VARCHAR(20) NOT NULL CHECK (category IN ('engine', 'brakes', 'electrical', 'tires', 'lubricants', 'body')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Initial Seed Data
-- ============================================================================

INSERT INTO public.customers (name, phone, plate_number, motorcycle_model)
VALUES
  ('Juan Dela Cruz', '09171234567', 'ABC-1234', 'Honda Click 125i'),
  ('Maria Santos', '09187654321', 'XYZ-9876', 'Yamaha NMAX 155')
ON CONFLICT (plate_number) DO NOTHING;

INSERT INTO public.repairs (customer_id, issue, mechanic, labor_cost, status)
VALUES
  (1, 'Full CVT cleaning and engine oil change', 'Berto', 850.00, 'in_progress'),
  (2, 'Front brake pad replacement and fluid bleed', 'Dante', 450.00, 'pending');

INSERT INTO public.parts (name, sku, qty, unit_price, category)
VALUES
  ('Synthetic Scooter Oil 10W-40', 'OIL-10W40', 25, 320.00, 'lubricants'),
  ('Ceramic Front Brake Pads NMAX', 'BRK-NMAXF', 12, 550.00, 'brakes')
ON CONFLICT (sku) DO NOTHING;
