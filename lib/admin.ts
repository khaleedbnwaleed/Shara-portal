import { getDb } from './db'
import { getUserFromSession } from './auth'

export async function ensureUsersTable() {
  const db = getDb()
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      avatar text,
      phone text,
      address text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)
}

export function isAdminUser(user: { email?: string | null; id?: number }) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (adminEmails.length > 0) {
    return adminEmails.includes(user.email?.toLowerCase() ?? '')
  }

  return user.id === 1
}

export async function getAdminUserFromSession(sessionToken: string | undefined) {
  if (!sessionToken) return null

  const user = await getUserFromSession(sessionToken)
  if (!user) return null

  return isAdminUser(user) ? user : null
}

export async function getAllUsers() {
  const db = getDb()
  await ensureUsersTable()
  const result = await db.query('SELECT * FROM users')
  return result.rows
}

export async function getAllBookings() {
  const { getUserBookings } = await import('./dashboard')
  return getUserBookings()
}

export async function getAllVolunteerApplications() {
  const { getUserVolunteerApplications } = await import('./dashboard')
  return getUserVolunteerApplications()
}

export async function getAllBinRequests() {
  const { getUserBinRequests } = await import('./dashboard')
  return getUserBinRequests()
}
