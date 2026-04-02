import { Pool } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Manually load .env.local
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envLines = envContent.split('\n')

let DATABASE_URL = ''
for (const line of envLines) {
  if (line.startsWith('DATABASE_URL=') && !line.startsWith('# ') && !line.startsWith('DATABASE_URL_UNPOOLED')) {
    DATABASE_URL = line.split('=')[1].trim()
    break
  }
}

async function createBootcampTable() {
  console.log('🔍 DATABASE_URL loaded:', DATABASE_URL?.substring(0, 50) + '...')

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: DATABASE_URL })

  try {
    console.log('🔧 Creating BootcampRegistration table...')

    const client = await pool.connect()

    // Create the table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "BootcampRegistration" (
        id VARCHAR(255) PRIMARY KEY,
        "fullName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(255) NOT NULL,
        "experienceLevel" VARCHAR(255) NOT NULL,
        "daysAttending" TEXT[] NOT NULL DEFAULT '{}',
        "paymentReceiptFile" VARCHAR(255) NOT NULL,
        "receiptUrl" VARCHAR(255),
        "registrationId" VARCHAR(255) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        verified BOOLEAN NOT NULL DEFAULT false,
        "verifiedAt" TIMESTAMP,
        "verifiedBy" VARCHAR(255),
        notes TEXT
      )
    `)

    console.log('✅ BootcampRegistration table created successfully')

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS "BootcampRegistration_email_idx" ON "BootcampRegistration"(email)
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS "BootcampRegistration_createdAt_idx" ON "BootcampRegistration"("createdAt")
    `)

    console.log('✅ Database indexes created successfully')
    console.log('✅ Database initialization complete!')

    client.release()
  } catch (error) {
    console.error('❌ Error creating table:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

createBootcampTable()
