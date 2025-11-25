import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// GET - Get user profile
export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        degreeType: true,
        emailVerified: true,
        notificationsEnabled: true,
        emailNotifications: true,
        reminderDays: true,
        defaultCurrency: true,
        programOfStudy: true,
        institutionName: true,
        intakeYear: true,
        intakeTerm: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      image: z.string().url().optional().nullable(),
      degreeType: z.enum(['undergrad', 'masters', 'phd']).optional(),
      notificationsEnabled: z.boolean().optional(),
      emailNotifications: z.boolean().optional(),
      reminderDays: z.number().min(1).max(30).optional(),
      defaultCurrency: z.string().optional(),
      programOfStudy: z.string().optional(),
      institutionName: z.string().optional(),
      intakeYear: z.number().optional(),
      intakeTerm: z.string().optional(),
    })

    const validatedData = updateSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        degreeType: true,
        notificationsEnabled: true,
        emailNotifications: true,
        reminderDays: true,
        defaultCurrency: true,
        programOfStudy: true,
        institutionName: true,
        intakeYear: true,
        intakeTerm: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating profile:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
