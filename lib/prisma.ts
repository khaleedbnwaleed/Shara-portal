import { PrismaClient } from '@prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Please configure your database connection.')
}

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

const createPrismaClient = () => {
  // Create a connection pool with proper configuration for Neon serverless
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    // Serverless-optimized settings
    max: 1, // Single connection for serverless
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 5000, // Timeout after 5 seconds
    statement_timeout: 30000, // Statement timeout 30 seconds
  })

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
  })

  const adapter = new PrismaNeon(pool)

  return new PrismaClient({
    adapter,
    errorFormat: 'pretty',
    // Add logging for debugging
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
