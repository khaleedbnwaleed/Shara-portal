import fs from 'fs'
import path from 'path'

export type QueryClient = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }>
}

const DB_FILE = path.resolve(process.cwd(), 'data.json')

type DatabaseShape = {
  users: Array<{ id: number; name: string; email: string; password_hash: string; created_at: string }>
  sessions: Array<{ id: number; user_id: number; token: string; expires_at: string; created_at: string }>
  volunteers: Array<Record<string, any>>
}

function readData(): DatabaseShape {
  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseShape = { users: [], sessions: [], volunteers: [] }
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2))
    return initial
  }

  const raw = fs.readFileSync(DB_FILE, 'utf-8')
  return JSON.parse(raw) as DatabaseShape
}

function writeData(data: DatabaseShape) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

function nextId(items: Array<{ id: number }>) {
  if (items.length === 0) return 1
  return Math.max(...items.map((item) => item.id)) + 1
}

export function getDb(): QueryClient {
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
        const [name, email, password_hash] = params as [string, string, string]
        const id = nextId(db.users)
        db.users.push({ id, name, email, password_hash, created_at: new Date().toISOString() })
        writeData(db)
        return { rows: [{ id }] }
      }

      // Select user by email
      if (/select .* from users .*where email =/i.test(sql)) {
        const email = (params?.[0] as string).toLowerCase()
        const user = db.users.find((u) => u.email.toLowerCase() === email)
        return { rows: user ? [user] : [] }
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
        return { rows: user ? [{ id: user.id, email: user.email, name: user.name }] : [] }
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

      // Fallback: return empty
      return { rows: [] }
    },
  }
}
