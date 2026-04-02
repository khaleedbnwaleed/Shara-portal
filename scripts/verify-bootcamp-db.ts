import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Pool } from '@neondatabase/serverless'

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

async function verifyDatabase() {
  console.log('🔍 Verifying Neon database setup...\n')

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env.local')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: DATABASE_URL })

  try {
    const client = await pool.connect()

    // Check if table exists
    console.log('📊 Checking if BootcampRegistration table exists...')
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'BootcampRegistration'
      )
    `)

    if (tableCheck.rows[0].exists) {
      console.log('✅ Table BootcampRegistration exists\n')

      // Get table structure
      const tableInfo = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'BootcampRegistration'
        ORDER BY ordinal_position
      `)

      console.log('📋 Table Schema:')
      tableInfo.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'}`)
      })
      console.log()

      // Count records
      const countResult = await client.query('SELECT COUNT(*) as count FROM "BootcampRegistration"')
      console.log(`📈 Total records in table: ${countResult.rows[0].count}\n`)

      // Show recent records
      if (countResult.rows[0].count > 0) {
        const recentRecords = await client.query(`
          SELECT id, "fullName", email, "registrationId", "createdAt", verified
          FROM "BootcampRegistration"
          ORDER BY "createdAt" DESC
          LIMIT 5
        `)
        
        console.log('📜 Recent records:')
        recentRecords.rows.forEach(record => {
          console.log(`   - ${record.fullName} (${record.email}) - ID: ${record.registrationId}`)
          console.log(`     Created: ${record.createdAt}, Verified: ${record.verified}`)
        })
      } else {
        console.log('⚠️  No records found in the table yet')
      }
    } else {
      console.log('❌ Table BootcampRegistration does NOT exist')
      console.log('⚠️  You need to run the database initialization script first')
    }

    client.release()
    await pool.end()
    console.log('\n✅ Database verification complete!')
  } catch (error) {
    console.error('❌ Error communicating with database:', error)
    process.exit(1)
  }
}

verifyDatabase()
