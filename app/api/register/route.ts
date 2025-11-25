import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { sendEmail, emailTemplates } from '@/lib/email'
import crypto from 'crypto'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
  degreeType: z.enum(['undergrad', 'masters', 'phd']),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name, degreeType } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')
    const emailTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        degreeType,
        emailVerificationToken,
        emailTokenExpiry,
      },
    })

    // Send welcome email with verification link (non-blocking)
    if (process.env.RESEND_API_KEY) {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${emailVerificationToken}`
      const template = emailTemplates.welcome(user.name || 'there')

      // Add verification link to welcome email
      const htmlWithVerification = template.html + `
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">
            Please verify your email address by clicking the button below:
          </p>
          <a href="${verificationUrl}"
             style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Verify Email Address
          </a>
          <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
            This link will expire in 24 hours.
          </p>
        </div>
      `

      sendEmail({
        to: user.email,
        subject: template.subject,
        html: htmlWithVerification,
      }).catch(error => console.error('Failed to send welcome email:', error))
    }

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
