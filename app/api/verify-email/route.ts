import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?error=invalid_token', req.url))
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?error=expired_token', req.url))
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailTokenExpiry: null,
      },
    })

    // Redirect to login with success message
    return NextResponse.redirect(new URL('/auth/login?verified=true', req.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=verification_failed', req.url))
  }
}
