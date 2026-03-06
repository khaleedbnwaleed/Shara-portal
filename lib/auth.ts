import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'
import { getDb } from './db'

const scrypt = promisify(_scrypt)
const KEY_LEN = 64

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scrypt(password, salt, KEY_LEN)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(':')
  if (!salt || !key) return false

  const derivedKey = (await scrypt(password, salt, KEY_LEN)) as Buffer
  const keyBuffer = Buffer.from(key, 'hex')
  return derivedKey.length === keyBuffer.length && cryptoTimingSafeEqual(derivedKey, keyBuffer)
}

function cryptoTimingSafeEqual(a: Buffer, b: Buffer) {
  try {
    return a.length === b.length && Buffer.from(a).equals(b)
  } catch {
    return false
  }
}

export function createSessionToken() {
  return randomBytes(32).toString('hex')
}

export async function createSession(userId: number) {
  const token = createSessionToken()
  const db = getDb()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

  await db.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id integer NOT NULL,
      token text NOT NULL UNIQUE,
      expires_at datetime NOT NULL,
      created_at datetime NOT NULL DEFAULT (datetime('now'))
    )
  `)

  await db.query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt.toISOString()],
  )

  return token
}

export async function getUserFromSession(token: string) {
  const db = getDb()
  const res = await db.query(
    `SELECT u.id, u.email, u.name
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > $2`,
    [token, new Date().toISOString()],
  )

  return res.rows[0] ?? null
}
