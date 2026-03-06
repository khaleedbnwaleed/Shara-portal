import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'
import { getPool } from './db'

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
  const pool = getPool()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id serial PRIMARY KEY,
      user_id integer NOT NULL,
      token text NOT NULL UNIQUE,
      expires_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  await pool.query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt],
  )

  return token
}

export async function getUserFromSession(token: string) {
  const pool = getPool()
  const res = await pool.query(
    `SELECT u.id, u.email, u.name
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > now()`,
    [token],
  )

  return res.rows[0] ?? null
}
