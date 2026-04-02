import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load DATABASE_URL from .env.local BEFORE any other imports that might use it
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envLines = envContent.split('\n')

for (const line of envLines) {
  if (line.startsWith('DATABASE_URL=') && !line.startsWith('# ') && !line.startsWith('DATABASE_URL_UNPOOLED')) {
    const value = line.split('=')[1].trim()
    process.env.DATABASE_URL = value
    console.log('✅ DATABASE_URL loaded from .env.local\n')
    break
  }
}

async function main() {
  // Now import prisma after env vars are set
  const { prisma } = await import('@/lib/prisma')

  console.log('🧪 Testing Bootcamp Database Connection...\n')

  try {
    // Test 1: Count existing records
    console.log('Test 1️⃣  Checking existing records...')
    const count = await prisma.bootcampRegistration.count()
    console.log(`✅ Found ${count} existing records\n`)

    // Test 2: Insert a test record
    console.log('Test 2️⃣  Testing record insertion...')
    const testId = `test-${Date.now()}`
    const testEmail = `test-${Date.now()}@example.com`

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
    console.log(`   Status: ${record.paymentStatus}`)
    console.log(`   Created: ${record.createdAt}\n`)

    // Test 3: Read the record back
    console.log('Test 3️⃣  Testing record retrieval...')
    const retrievedRecord = await prisma.bootcampRegistration.findUnique({
      where: { id: testId },
    })

    if (retrievedRecord) {
      console.log(`✅ Record retrieved successfully`)
      console.log(`   Name: ${retrievedRecord.fullName}`)
      console.log(`   Email: ${retrievedRecord.email}\n`)

      // Test 4: List records
      console.log('Test 4️⃣  Listing recent records...')
      const recentRecords = await prisma.bootcampRegistration.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          paymentStatus: true,
          createdAt: true,
        },
      })

      console.log(`✅ Found ${recentRecords.length} recent records:`)
      recentRecords.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec.fullName} (${rec.email}) - ${rec.paymentStatus}`)
      })
      console.log()

      // Test 5: Delete the test record
      console.log('Test 5️⃣  Cleaning up test record...')
      await prisma.bootcampRegistration.delete({
        where: { id: testId },
      })
      console.log('✅ Test record deleted\n')
    } else {
      throw new Error('Could not retrieve inserted record')
    }

    // Final summary
    const finalCount = await prisma.bootcampRegistration.count()
    console.log(`✅ All tests passed!`)
    console.log(`📊 Current records in database: ${finalCount}`)
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
