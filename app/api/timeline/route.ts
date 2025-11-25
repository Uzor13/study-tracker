import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Get user's timeline milestones
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

    // Get user's visa profile or create one
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
      return NextResponse.json({ milestones: [] })
    }

    // Get timeline milestones
    const milestones = await prisma.timeline.findMany({
      where: {
        userId: user.id,
        visaProfileId: visaProfile.id,
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({ milestones })
  } catch (error) {
    console.error('Error fetching timeline:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    )
  }
}

// POST - Create or update milestone
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
      title: z.string(),
      description: z.string().optional(),
      date: z.string(),
      type: z.string(),
      completed: z.boolean(),
      milestoneId: z.string().optional(),
    })

    const { title, description, date, type, completed, milestoneId } = schema.parse(body)

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

    // Check if milestone already exists with this title
    const existingMilestone = milestoneId
      ? await prisma.timeline.findUnique({
          where: { id: milestoneId },
        })
      : await prisma.timeline.findFirst({
          where: {
            userId: user.id,
            visaProfileId: visaProfile.id,
            title,
          },
        })

    let milestone

    if (existingMilestone) {
      // Update existing milestone
      milestone = await prisma.timeline.update({
        where: { id: existingMilestone.id },
        data: {
          completed,
          status: completed ? 'completed' : new Date(date) < new Date() ? 'overdue' : 'upcoming',
        },
      })
    } else {
      // Create new milestone
      milestone = await prisma.timeline.create({
        data: {
          userId: user.id,
          visaProfileId: visaProfile.id,
          title,
          description: description || '',
          date: new Date(date),
          type,
          completed,
          status: completed ? 'completed' : new Date(date) < new Date() ? 'overdue' : 'upcoming',
        },
      })
    }

    return NextResponse.json({ success: true, milestone })
  } catch (error) {
    console.error('Error saving milestone:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to save milestone' },
      { status: 500 }
    )
  }
}
