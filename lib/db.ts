import fs from 'fs'
import path from 'path'
import { Pool } from '@neondatabase/serverless'

export type QueryClient = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }>
}

type DbUser = { id: number; name: string; email: string; password_hash: string; created_at: string }
type DbSession = { id: number; user_id: number; token: string; expires_at: string; created_at: string }

type DatabaseShape = {
  users: DbUser[]
  sessions: DbSession[]
  volunteers: Array<Record<string, any>>
  bookings: Array<Record<string, any>>
  binRequests: Array<Record<string, any>>
}

const DB_FILE = path.resolve(process.cwd(), 'data.json')

function readData(): DatabaseShape {
  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseShape = { users: [], sessions: [], volunteers: [], bookings: [], binRequests: [] }
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2))
    return initial
  }

  const raw = fs.readFileSync(DB_FILE, 'utf-8')
  const data = JSON.parse(raw) as Partial<DatabaseShape>
  return {
    users: data.users ?? [],
    sessions: data.sessions ?? [],
    volunteers: data.volunteers ?? [],
    bookings: data.bookings ?? [],
    binRequests: data.binRequests ?? [],
  }
}

function writeData(data: Record<string, any>) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

function nextId(items: Array<{ id: number }>) {
  if (items.length === 0) return 1
  return Math.max(...items.map((item) => item.id)) + 1
}

function createJsonDb(): QueryClient {
  return {
    query: async (text: string, params: unknown[] = []) => {
      const db = readData()
      const sql = text.trim().toLowerCase()

      // Create table statements are no-ops in JSON store
      if (sql.startsWith('create table')) {
        return { rows: [] }
      }

      // Insert user
      if (/insert into users/i.test(sql)) {
        const [name, email, password_hash, avatar, phone, address] = params as [
          string,
          string,
          string,
          string | null | undefined,
          string | null | undefined,
          string | null | undefined,
        ]
        const id = nextId(db.users)
        db.users.push({
          id,
          name,
          email,
          password_hash,
          avatar: avatar ?? null,
          phone: phone ?? null,
          address: address ?? null,
          created_at: new Date().toISOString(),
        })
        writeData(db)
        return { rows: [{ id }] }
      }

      // Select user by email
      if (/select .* from users .*where email =/i.test(sql)) {
        const email = (params?.[0] as string).toLowerCase()
        const user = db.users.find((u) => u.email.toLowerCase() === email)
        return { rows: user ? [user] : [] }
      }

      // Select all users
      if (/select .* from users/i.test(sql) && !/where/i.test(sql)) {
        return { rows: db.users }
      }

      // Insert session
      if (/insert into sessions/i.test(sql)) {
        const [userId, token, expiresAt] = params as [number, string, string]
        const id = nextId(db.sessions)
        db.sessions.push({ id, user_id: userId, token, expires_at: expiresAt, created_at: new Date().toISOString() })
        writeData(db)
        return { rows: [{ id }] }
      }

      // Select user from session
      if (/from sessions s/i.test(sql) && /join users u/i.test(sql)) {
        const token = params?.[0] as string
        const now = (params?.[1] as string) || new Date().toISOString()
        const session = db.sessions.find((s) => s.token === token && s.expires_at > now)
        if (!session) return { rows: [] }
        const user = db.users.find((u) => u.id === session.user_id)
        return { rows: user ? [user] : [] }
      }

      // Delete session by token
      if (/delete from sessions/i.test(sql)) {
        const token = params?.[0] as string
        db.sessions = db.sessions.filter((s) => s.token !== token)
        writeData(db)
        return { rows: [] }
      }
      // Update user fields
      if (/update users set/i.test(sql)) {
        const id = params?.[params.length - 1] as number
        const user = db.users.find((u) => u.id === id)
        if (!user) return { rows: [] }

        // Parse assignments from SQL string (case-insensitive)
        const match = /set\s+(.+?)\s+where/i.exec(text)
        const assignments = match?.[1]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean) ?? []

        assignments.forEach((assign, idx) => {
          const [key] = assign.split('=')
          const field = key.trim().replace(/"/g, '').toLowerCase()
          const value = params[idx]
          ;(user as any)[field] = value
        })

        writeData(db)
        return { rows: [user] }
      }
      // Insert volunteer entry
      if (/insert into volunteers/i.test(sql)) {
        const fields = text
          .split('(')[1]
          .split(')')[0]
          .split(',')
          .map((f) => f.trim())
        const values = params || []
        const record: any = {}
        fields.forEach((field, idx) => {
          record[field] = values[idx]
        })
        record.id = nextId(db.volunteers as any)
        record.created_at = new Date().toISOString()
        db.volunteers.push(record)
        writeData(db)
        return { rows: [{ id: record.id }] }
      }

      // Insert booking entry
      if (/insert into bookings/i.test(sql)) {
        const fields = text
          .split('(')[1]
          .split(')')[0]
          .split(',')
          .map((f) => f.trim())
        const values = params || []
        const record: any = {}
        fields.forEach((field, idx) => {
          record[field] = values[idx]
        })
        record.id = nextId(db.bookings as any)
        record.created_at = new Date().toISOString()
        db.bookings.push(record)
        writeData(db)
        return { rows: [{ id: record.id }] }
      }

      // Select bookings for a user
      if (/from bookings/i.test(sql)) {
        const userId = params?.[0] as number | undefined
        const filtered = typeof userId === 'number'
          ? db.bookings.filter((b) => b.user_id === userId)
          : db.bookings
        return { rows: filtered }
      }

      // Select volunteer entries for a user (by id or email)
      if (/from volunteers/i.test(sql)) {
        const param = params?.[0]
        const filtered = typeof param === 'number'
          ? db.volunteers.filter((v) => v.user_id === param)
          : typeof param === 'string'
          ? db.volunteers.filter((v) => String(v.email).toLowerCase() === param.toLowerCase())
          : db.volunteers
        return { rows: filtered }
      }

      // Insert bin request
      if (/insert into bin_requests/i.test(sql)) {
        const fields = text
          .split('(')[1]
          .split(')')[0]
          .split(',')
          .map((f) => f.trim())
        const values = params || []
        const record: any = {}
        fields.forEach((field, idx) => {
          record[field] = values[idx]
        })
        record.id = nextId(db.binRequests as any)
        record.created_at = new Date().toISOString()
        db.binRequests.push(record)
        writeData(db)
        return { rows: [{ id: record.id }] }
      }

      // Select bin requests for a user
      if (/from bin_requests/i.test(sql)) {
        const userId = params?.[0] as number | undefined
        const filtered = typeof userId === 'number'
          ? db.binRequests.filter((b) => b.user_id === userId)
          : db.binRequests
        return { rows: filtered }
      }

      // Fallback: return empty
      return { rows: [] }
    },
  }
}

let pool: Pool | undefined

function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEXT_PUBLIC_NEON_DATABASE_URL
  )
}

export function getDbInfo() {
  const connectionString = resolveDatabaseUrl()
  const forceJson = process.env.USE_LOCAL_DB === 'true'

  const usingLocal = !connectionString || forceJson
  return {
    mode: usingLocal ? 'local' : 'neon',
    connectionString: connectionString ?? null,
    usingLocal,
    forcedLocal: forceJson,
  }
}

function getPool(): Pool {
  if (pool) return pool

  const info = getDbInfo()

  if (!info.connectionString) {
    if (info.forcedLocal) {
      console.warn(
        'NEON_DATABASE_URL (or DATABASE_URL/POSTGRES_URL) is not set. Using local JSON database (data.json) because USE_LOCAL_DB=true.',
      )
      return null as any
    }

    throw new Error(
      'NEON_DATABASE_URL (or DATABASE_URL/POSTGRES_URL) is required for database access.\n' +
        'Set it in your environment variables, or set USE_LOCAL_DB=true to use the local JSON fallback.',
    )
  }

  pool = new Pool({ connectionString: info.connectionString })
  return pool
}

export function getDb(): QueryClient {
  const poolInstance = getPool()
  if (!poolInstance) {
    return createJsonDb()
  }

  return {
    query: async (text: string, params: unknown[] = []) => {
      const result = await poolInstance.query(text, params)
      return { rows: result.rows }
    },
  }
}
