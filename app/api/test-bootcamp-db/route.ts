import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🧪 Database test endpoint called')
    
    // Test 1: Count records
    const count = await prisma.bootcampRegistration.count()
    console.log(`✅ Count query successful: ${count} records`)

    // Test 2: Fetch recent records
    const recent = await prisma.bootcampRegistration.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        paymentStatus: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      status: 'success',
      message: 'Database connection is working',
      stats: {
        totalRecords: count,
        recentRecords: recent,
      },
    })
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: String(error),
      },
      { status: 500 }
    )
  }
}
