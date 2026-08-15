import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🧪 Database test endpoint called')

    const countResult = await prisma.$queryRaw<Array<{ count: number }>>`SELECT COUNT(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public'`
    const count = Number(countResult?.[0]?.count ?? 0)

    return NextResponse.json({
      status: 'success',
      message: 'Database connection is working',
      stats: {
        totalRecords: count,
        recentRecords: [],
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
