import { getDb } from './db'

export async function getUserBookings(userId?: number) {
  const db = getDb()

  await db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id integer,
      full_name text NOT NULL,
      service_type text NOT NULL,
      industry_type text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const query = userId != null ? 'SELECT * FROM bookings WHERE user_id = $1 ORDER BY id DESC' : 'SELECT * FROM bookings ORDER BY id DESC'
  const params = userId != null ? [userId] : []

  const result = await db.query(query, params)
  return result.rows
}

export async function getUserVolunteerApplications(userId?: number) {
  const db = getDb()

  await db.query(`
    CREATE TABLE IF NOT EXISTS volunteers (
      id SERIAL PRIMARY KEY,
      user_id integer,
      name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      education text NOT NULL,
      education_other text,
      state_of_origin text NOT NULL,
      lga text NOT NULL,
      address text NOT NULL,
      initiatives text,
      skills text,
      hours_availability text NOT NULL,
      why_interested text NOT NULL,
      hope_gain text NOT NULL,
      signature text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const query = userId != null ? 'SELECT * FROM volunteers WHERE user_id = $1 ORDER BY id DESC' : 'SELECT * FROM volunteers ORDER BY id DESC'
  const params = userId != null ? [userId] : []

  const result = await db.query(query, params)
  return result.rows
}

export async function getUserBinRequests(userId?: number) {
  const db = getDb()

  await db.query(`
    CREATE TABLE IF NOT EXISTS bin_requests (
      id SERIAL PRIMARY KEY,
      user_id integer,
      bin_type text NOT NULL,
      quantity integer NOT NULL,
      address text NOT NULL,
      pickup_date timestamptz,
      notes text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  // Ensure schema is up to date
  await db.query('ALTER TABLE bin_requests ADD COLUMN IF NOT EXISTS pickup_date timestamptz')
  await db.query('ALTER TABLE bin_requests ADD COLUMN IF NOT EXISTS notes text')

  const query = userId != null ? 'SELECT * FROM bin_requests WHERE user_id = $1 ORDER BY id DESC' : 'SELECT * FROM bin_requests ORDER BY id DESC'
  const params = userId != null ? [userId] : []

  const result = await db.query(query, params)
  return result.rows
}
