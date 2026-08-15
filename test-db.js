require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

(async () => {
  try {
    console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.log('Initializing Prisma client with PostgreSQL adapter...');
    
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    const prisma = new PrismaClient({ adapter });
    console.log('✅ Prisma client created');

    console.log('Testing database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');

    console.log('Checking InternshipApplication table...');
    const count = await prisma.internshipApplication.count();
    console.log(`✅ InternshipApplication table accessible, current applications: ${count}`);

    const recent = await prisma.internshipApplication.findFirst({
      orderBy: { submittedAt: 'desc' },
      select: { id: true, fullName: true, email: true, applicationRef: true, submittedAt: true },
    });

    if (recent) {
      console.log('✅ Latest application:', {
        ref: recent.applicationRef,
        name: recent.fullName,
        email: recent.email,
      });
    }

    await prisma.$disconnect();
    console.log('✅ All checks passed - database is working correctly');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) console.error('Error code:', error.code);
    process.exit(1);
  }
})();
