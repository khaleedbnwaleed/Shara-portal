require('dotenv').config({ path: '.env.local' });

console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('- DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'NOT SET');

try {
  console.log('\nImporting @prisma/client...');
  const { PrismaClient } = require('@prisma/client');
  console.log('✅ @prisma/client imported successfully');

  console.log('\nCreating PrismaClient instance...');
  console.log('- Passing options: {}');
  
  const prisma = new PrismaClient({
    // Try with empty options
  });
  
  console.log('✅ PrismaClient instance created');
  
  (async () => {
    try {
      console.log('\nTesting connection...');
      const result = await prisma.$queryRaw`SELECT NOW()`;
      console.log('✅ Database query successful:', result);
      
      const count = await prisma.internshipApplication.count();
      console.log(`✅ Table query successful: ${count} applications`);
      
      await prisma.$disconnect();
      console.log('\n✅ All tests passed!');
    } catch (e) {
      console.error('\n❌ Query error:', e.message);
      console.error('Code:', e.code);
      process.exit(1);
    }
  })();
} catch (e) {
  console.error('\n❌ Initialization error:', e.message);
  console.error('Stack:', e.stack);
  process.exit(1);
}
