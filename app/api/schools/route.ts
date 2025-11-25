import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all'
    const province = searchParams.get('province') || 'all'
    const degreeType = searchParams.get('degreeType') || 'all'
    const sort = searchParams.get('sort') || 'ranking'

    // Build where clause
    const where: any = {
      active: true,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type !== 'all') {
      where.type = type
    }

    if (province !== 'all') {
      where.province = province
    }

    // Filter by degree type
    if (degreeType !== 'all') {
      where[degreeType] = true
    }

    // Build orderBy clause
    let orderBy: any = {}
    if (sort === 'ranking') {
      orderBy = [
        { ranking: { sort: 'asc', nulls: 'last' } },
        { name: 'asc' }
      ]
    } else if (sort === 'tuition') {
      orderBy = { tuitionUndergrad: { sort: 'asc', nulls: 'last' } }
    } else if (sort === 'name') {
      orderBy = { name: 'asc' }
    }

    const schools = await prisma.canadianSchool.findMany({
      where,
      orderBy,
    })

    return NextResponse.json({ schools })
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    )
  }
}
