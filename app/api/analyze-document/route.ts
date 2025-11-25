import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { analyzeDocument } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentText, documentType } = await req.json()

    // Validate inputs
    if (!documentText || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: documentText, documentType' },
        { status: 400 }
      )
    }

    if (!['sop', 'cv', 'letter'].includes(documentType)) {
      return NextResponse.json(
        { error: 'Invalid document type. Must be: sop, cv, or letter' },
        { status: 400 }
      )
    }

    // Check document length (minimum 50 characters, maximum 10,000)
    if (documentText.length < 50) {
      return NextResponse.json(
        { error: 'Document too short. Please provide at least 50 characters.' },
        { status: 400 }
      )
    }

    if (documentText.length > 10000) {
      return NextResponse.json(
        { error: 'Document too long. Maximum 10,000 characters allowed.' },
        { status: 400 }
      )
    }

    // Analyze document with AI
    const analysis = await analyzeDocument(
      documentText,
      documentType as 'sop' | 'cv' | 'letter'
    )

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('Error analyzing document:', error)

    // Check if it's a Gemini API error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please contact support.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to analyze document. Please try again.' },
      { status: 500 }
    )
  }
}
