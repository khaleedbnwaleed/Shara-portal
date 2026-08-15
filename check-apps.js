const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const count = await prisma.internshipApplication.count();
    console.log('Total apps:', count);
    
    if (count > 0) {
      const latest = await prisma.internshipApplication.findFirst({
        orderBy: { submittedAt: 'desc' },
      });
      console.log('Latest app:', JSON.stringify({
        ref: latest.applicationRef,
        name: latest.fullName,
        email: latest.email,
        position: latest.position,
        status: latest.status,
      }));
    }
  } catch (e) {
    console.error('DB Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
