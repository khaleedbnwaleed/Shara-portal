import { Pool } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "@prisma/client"

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const pool = new Pool({ connectionString: DATABASE_URL })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

async function initializeDatabase() {
  try {
    console.log("🔧 Initializing Bootcamp database schema...")

    // Create the BootcampRegistration table schema
    const createTableSQL = `
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
      );

      CREATE INDEX IF NOT EXISTS "BootcampRegistration_email_idx" ON "BootcampRegistration"(email);
      CREATE INDEX IF NOT EXISTS "BootcampRegistration_createdAt_idx" ON "BootcampRegistration"("createdAt");
    `

    // Execute the SQL directly using the pool
    const client = await pool.connect()
    try {
      await client.query(createTableSQL)
      console.log("✅ BootcampRegistration table created successfully")
    } finally {
      client.release()
    }

    // Test the connection with Prisma
    const testRecord = await prisma.bootcampRegistration.count()
    console.log(`✅ Prisma connected successfully. Current records: ${testRecord}`)

    console.log("✅ Database initialization complete!")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

initializeDatabase()
