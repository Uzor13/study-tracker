import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - Get user's applications
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

    // Get applications
    const applications = await prisma.application.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// POST - Create new application
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, degreeType: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()

    const schema = z.object({
      institutionName: z.string(),
      program: z.string(),
      level: z.string(),
      city: z.string(),
      province: z.string(),
      applicationFee: z.number().default(0),
      tuitionFee: z.number().default(0),
    })

    const data = schema.parse(body)

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

    // Check if application already exists for this school
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: user.id,
        visaProfileId: visaProfile.id,
        institutionName: data.institutionName,
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Application for this school already exists' },
        { status: 400 }
      )
    }

    // Create new application
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        visaProfileId: visaProfile.id,
        institutionName: data.institutionName,
        program: data.program,
        level: data.level,
        city: data.city,
        province: data.province,
        applicationFee: data.applicationFee,
        tuitionFee: data.tuitionFee,
        status: 'not_started',
      },
    })

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error('Error creating application:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}

// PATCH - Update application
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
      status: z.string().optional(),
      appliedDate: z.string().optional().nullable(),
      decisionDate: z.string().optional().nullable(),
      notes: z.string().optional(),
    })

    const { id, ...updates } = schema.parse(body)

    // Update application
    const application = await prisma.application.update({
      where: {
        id,
        userId: user.id, // Ensure user owns this application
      },
      data: {
        ...updates,
        appliedDate: updates.appliedDate ? new Date(updates.appliedDate) : undefined,
        decisionDate: updates.decisionDate ? new Date(updates.decisionDate) : undefined,
      },
    })

    return NextResponse.json({ success: true, application })
  } catch (error) {
    console.error('Error updating application:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE - Delete application
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
      return NextResponse.json({ error: 'Application ID required' }, { status: 400 })
    }

    // Delete application
    await prisma.application.delete({
      where: {
        id,
        userId: user.id, // Ensure user owns this application
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}
