import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - Get user's finance records
export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create visa profile
    let visaProfile = await prisma.visaProfile.findFirst({
      where: {
        userId: user.id,
      },
    })

    // If no visa profile exists, create a default one with study permit
    if (!visaProfile) {
      const studyPermitCategory = await prisma.visaCategory.findFirst({
        where: { slug: 'study-permit' },
      })

      if (studyPermitCategory) {
        visaProfile = await prisma.visaProfile.create({
          data: {
            userId: user.id,
            visaCategoryId: studyPermitCategory.id,
            status: 'in_progress',
          },
        })
      }
    }

    if (!visaProfile) {
      return NextResponse.json({ finances: [] })
    }

    // Get finance records
    const finances = await prisma.finance.findMany({
      where: {
        userId: user.id,
        visaProfileId: visaProfile.id,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ finances })
  } catch (error) {
    console.error('Error fetching finances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch finances' },
      { status: 500 }
    )
  }
}

// POST - Create new finance record
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()

    const schema = z.object({
      category: z.string(),
      description: z.string(),
      amount: z.number(),
      currency: z.string().default('CAD'),
      dueDate: z.string().optional(),
    })

    const { category, description, amount, currency, dueDate } = schema.parse(body)

    // Get or create visa profile
    let visaProfile = await prisma.visaProfile.findFirst({
      where: { userId: user.id },
    })

    if (!visaProfile) {
      const studyPermitCategory = await prisma.visaCategory.findFirst({
        where: { slug: 'study-permit' },
      })

      if (!studyPermitCategory) {
        return NextResponse.json({ error: 'Visa category not found' }, { status: 404 })
      }

      visaProfile = await prisma.visaProfile.create({
        data: {
          userId: user.id,
          visaCategoryId: studyPermitCategory.id,
          status: 'in_progress',
        },
      })
    }

    // Create new finance record
    const finance = await prisma.finance.create({
      data: {
        userId: user.id,
        visaProfileId: visaProfile.id,
        category,
        description,
        amount,
        currency,
        paid: false,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json({ success: true, finance })
  } catch (error) {
    console.error('Error creating finance:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create finance record' },
      { status: 500 }
    )
  }
}

// PATCH - Update finance record (mark as paid/unpaid)
export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()

    const schema = z.object({
      id: z.string(),
      paid: z.boolean(),
      paidDate: z.string().optional().nullable(),
    })

    const { id, paid, paidDate } = schema.parse(body)

    // Update finance record
    const finance = await prisma.finance.update({
      where: {
        id,
        userId: user.id, // Ensure user owns this record
      },
      data: {
        paid,
        paidDate: paidDate ? new Date(paidDate) : null,
      },
    })

    return NextResponse.json({ success: true, finance })
  } catch (error) {
    console.error('Error updating finance:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update finance record' },
      { status: 500 }
    )
  }
}

// DELETE - Delete finance record
export async function DELETE(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Finance ID required' }, { status: 400 })
    }

    // Delete finance record
    await prisma.finance.delete({
      where: {
        id,
        userId: user.id, // Ensure user owns this record
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting finance:', error)
    return NextResponse.json(
      { error: 'Failed to delete finance record' },
      { status: 500 }
    )
  }
}
