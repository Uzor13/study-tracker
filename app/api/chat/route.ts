import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { chatWithAssistant } from '@/lib/ai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, chatHistory } = await req.json()

    // Validate inputs
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid message' },
        { status: 400 }
      )
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long. Maximum 2000 characters.' },
        { status: 400 }
      )
    }

    // Validate chat history if provided
    let validatedHistory: Array<{ role: 'user' | 'model'; text: string }> = []
    if (chatHistory && Array.isArray(chatHistory)) {
      // Limit history to last 10 messages for performance
      validatedHistory = chatHistory
        .slice(-10)
        .filter(
          (msg: any) =>
            msg &&
            typeof msg === 'object' &&
            (msg.role === 'user' || msg.role === 'model') &&
            typeof msg.text === 'string'
        )
    }

    // Get AI response
    const response = await chatWithAssistant(message, validatedHistory)

    return NextResponse.json({
      success: true,
      response,
    })
  } catch (error) {
    console.error('Error in chat API:', error)

    // Check if it's a Gemini API error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please contact support.' },
          { status: 500 }
        )
      }

      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'AI service temporarily unavailable. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    )
  }
}
