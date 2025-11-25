import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'CanStudy Tracker <noreply@canstudy.app>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to CanStudy Tracker!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Welcome to CanStudy Tracker!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining CanStudy Tracker. We're excited to help you manage your Canadian visa application journey.</p>
        <p>Get started by:</p>
        <ul>
          <li>Adding your school applications</li>
          <li>Setting up your document checklist</li>
          <li>Tracking your expenses</li>
        </ul>
        <p>Best of luck with your application!</p>
        <p>The CanStudy Tracker Team</p>
      </div>
    `,
  }),

  deadlineReminder: (name: string, item: string, date: string, daysLeft: number) => ({
    subject: `Reminder: ${item} due in ${daysLeft} days`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Upcoming Deadline Reminder</h1>
        <p>Hi ${name},</p>
        <p>This is a friendly reminder that you have an upcoming deadline:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1f2937;">${item}</h2>
          <p style="font-size: 18px; color: #ef4444; margin: 10px 0;">Due: ${date}</p>
          <p style="font-size: 16px; color: #6b7280;">${daysLeft} days remaining</p>
        </div>
        <p>Log in to CanStudy Tracker to manage your application.</p>
        <p>Best regards,<br/>The CanStudy Tracker Team</p>
      </div>
    `,
  }),

  statusUpdate: (name: string, item: string, newStatus: string) => ({
    subject: `Status Update: ${item}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Application Status Update</h1>
        <p>Hi ${name},</p>
        <p>Your application status has been updated:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1f2937;">${item}</h2>
          <p style="font-size: 18px; color: #10b981; margin: 10px 0;">New Status: ${newStatus}</p>
        </div>
        <p>Log in to CanStudy Tracker to view more details.</p>
        <p>Best regards,<br/>The CanStudy Tracker Team</p>
      </div>
    `,
  }),
}
