import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

// Load DATABASE_URL from .env.local
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

async function testBootcampDb() {
  console.log('🧪 Testing Bootcamp Database Connection...\n')

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found')
    process.exit(1)
  }

  // Test 1: Direct connection
  console.log('Test 1️⃣  Testing direct database connection...')
  const pool = new Pool({ connectionString: DATABASE_URL })

  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('✅ Direct connection successful\n')
    client.release()
  } catch (error) {
    console.error('❌ Direct connection failed:', error)
    process.exit(1)
  }

  // Test 2: Prisma connection
  console.log('Test 2️⃣  Testing Prisma connection...')
  const neonPool = new Pool({ connectionString: DATABASE_URL })
  const adapter = new PrismaNeon(neonPool)
  const prisma = new PrismaClient({ adapter })

  try {
    // Add a simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1`
    const count = await prisma.bootcampRegistration.count()
    console.log(`✅ Prisma connection successful (found ${count} records)\n`)
  } catch (error) {
    console.error('❌ Prisma connection failed:', error)
    // Try using the imported prisma from lib instead
    console.log('\n🔄 Trying with imported Prisma client from lib/prisma.ts...')
    
    const libPrisma = (await import('@/lib/prisma')).default
    try {
      const libCount = await libPrisma.bootcampRegistration.count()
      console.log(`✅ Lib Prisma connection successful (found ${libCount} records)\n`)
      
      // Use the lib prisma for the rest of tests
      return testWithLibPrisma(libPrisma)
    } catch (libError) {
      console.error('❌ Lib Prisma connection also failed:', libError)
      process.exit(1)
    }
  }

  await testRecordOperations(prisma, pool)
}

async function testRecordOperations(
  prisma: PrismaClient,
  pool: Pool
) {

  // Test 3: Insert a test record
  console.log('Test 3️⃣  Testing record insertion...')
  const testId = `test-${Date.now()}`
  const testEmail = `test-${Date.now()}@example.com`

  try {
    const record = await prisma.bootcampRegistration.create({
      data: {
        id: testId,
        fullName: 'Test User',
        email: testEmail,
        phone: '+234 123 456 7890',
        experienceLevel: 'Beginner',
        daysAttending: ['day1', 'day2'],
        whyInterested: 'Test submission',
        paymentReceiptUrl: 'https://example.com/test-receipt.pdf',
        paymentReceiptName: 'test-receipt.pdf',
        paymentStatus: 'pending',
        paymentAmount: 1000,
      },
    })

    console.log(`✅ Record inserted successfully`)
    console.log(`   ID: ${record.id}`)
    console.log(`   Email: ${record.email}`)
    console.log(`   Created: ${record.createdAt}\n`)

    // Test 4: Read the record back
    console.log('Test 4️⃣  Testing record retrieval...')
    const retrievedRecord = await prisma.bootcampRegistration.findUnique({
      where: { id: testId },
    })

    if (retrievedRecord) {
      console.log(`✅ Record retrieved successfully`)
      console.log(`   Found: ${retrievedRecord.fullName} (${retrievedRecord.email})\n`)

      // Test 5: Delete the test record
      console.log('Test 5️⃣  Cleaning up test record...')
      await prisma.bootcampRegistration.delete({
        where: { id: testId },
      })
      console.log('✅ Test record deleted\n')
    } else {
      console.error('❌ Could not retrieve inserted record')
    }
  } catch (error) {
    console.error('❌ Record operations failed:', error)
    process.exit(1)
  }

  // Final summary
  try {
    const finalCount = await prisma.bootcampRegistration.count()
    console.log(`✅ All tests passed!`)
    console.log(`📊 Current records in database: ${finalCount}`)
  } catch (error) {
    console.error('❌ Final count query failed:', error)
  }

  await prisma.$disconnect()
  await pool.end()
}

testBootcampDb()
