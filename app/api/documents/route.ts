import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Get user's documents
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
      where: { userId: user.id },
    })

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
      return NextResponse.json({ documents: [] })
    }

    // Get documents
    const documents = await prisma.document.findMany({
      where: {
        userId: user.id,
        visaProfileId: visaProfile.id,
      },
      orderBy: { category: 'asc' },
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST - Create or update document
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
      name: z.string(),
      description: z.string().optional(),
      category: z.string(),
      required: z.boolean().default(true),
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

    // Check if document already exists
    const existingDocument = await prisma.document.findFirst({
      where: {
        userId: user.id,
        visaProfileId: visaProfile.id,
        name: data.name,
      },
    })

    if (existingDocument) {
      return NextResponse.json(
        { error: 'Document with this name already exists' },
        { status: 400 }
      )
    }

    // Create new document
    const document = await prisma.document.create({
      data: {
        userId: user.id,
        visaProfileId: visaProfile.id,
        name: data.name,
        description: data.description,
        category: data.category,
        required: data.required,
        status: 'not_started',
      },
    })

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error('Error creating document:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}

// PATCH - Update document
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
      fileUrl: z.string().optional().nullable(),
      fileName: z.string().optional().nullable(),
      fileSize: z.number().optional().nullable(),
      fileType: z.string().optional().nullable(),
      uploadedDate: z.string().optional().nullable(),
      expiryDate: z.string().optional().nullable(),
      notes: z.string().optional(),
    })

    const { id, ...updates } = schema.parse(body)

    // Update document
    const document = await prisma.document.update({
      where: {
        id,
        userId: user.id, // Ensure user owns this document
      },
      data: {
        ...updates,
        uploadedDate: updates.uploadedDate ? new Date(updates.uploadedDate) : undefined,
        expiryDate: updates.expiryDate ? new Date(updates.expiryDate) : undefined,
      },
    })

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error('Error updating document:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}
