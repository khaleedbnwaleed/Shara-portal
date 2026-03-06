import { Pool } from 'pg'

let cachedPool: Pool | null = null

export function getPool() {
  if (cachedPool) return cachedPool

  const connectionString = process.env.NEON_DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing NEON_DATABASE_URL environment variable')
  }

  const pool = new Pool({
    connectionString,
  })

  if (process.env.NODE_ENV !== 'production') {
    // Keep a cached pool during development to avoid exhausting connections.
    cachedPool = pool
  }

  return pool
}
