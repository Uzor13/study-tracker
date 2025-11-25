import { addMonths, subMonths, subWeeks, format, differenceInDays } from 'date-fns'

export type IntakeSeason = 'september' | 'january' | 'may'

export interface TimelineMilestone {
  title: string
  description: string
  category: 'application' | 'visa' | 'preparation' | 'arrival'
  dueDate: Date
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  order: number
}

/**
 * Get the next intake date based on the selected season
 */
export function getIntakeDate(season: IntakeSeason, year?: number): Date {
  const currentYear = year || new Date().getFullYear()
  const currentDate = new Date()

  const intakeDates = {
    september: new Date(currentYear, 8, 1), // September 1
    january: new Date(currentYear, 0, 1),    // January 1
    may: new Date(currentYear, 4, 1),        // May 1
  }

  let intakeDate = intakeDates[season]

  // If the intake date has passed, use next year
  if (intakeDate < currentDate) {
    intakeDate = new Date(currentYear + 1, intakeDate.getMonth(), 1)
  }

  return intakeDate
}

/**
 * Generate a complete timeline based on intake date
 */
export function generateTimeline(intakeDate: Date): TimelineMilestone[] {
  const milestones: TimelineMilestone[] = []

  // 1. School Research & Selection (8-10 months before)
  milestones.push({
    title: 'Research Canadian Schools',
    description: 'Browse schools, compare programs, check admission requirements',
    category: 'application',
    dueDate: subMonths(intakeDate, 10),
    priority: 'high',
    completed: false,
    order: 1,
  })

  // 2. Prepare Application Documents (6-8 months before)
  milestones.push({
    title: 'Gather Academic Documents',
    description: 'Collect transcripts, diplomas, recommendation letters',
    category: 'application',
    dueDate: subMonths(intakeDate, 8),
    priority: 'high',
    completed: false,
    order: 2,
  })

  // 3. Language Test (6-7 months before)
  milestones.push({
    title: 'Take Language Test',
    description: 'Complete IELTS, TOEFL, or PTE Academic',
    category: 'application',
    dueDate: subMonths(intakeDate, 7),
    priority: 'high',
    completed: false,
    order: 3,
  })

  // 4. Submit School Applications (5-6 months before)
  milestones.push({
    title: 'Submit University Applications',
    description: 'Apply to your selected schools before deadlines',
    category: 'application',
    dueDate: subMonths(intakeDate, 6),
    priority: 'high',
    completed: false,
    order: 4,
  })

  // 5. Pay Application Fees (5-6 months before)
  milestones.push({
    title: 'Pay Application Fees',
    description: 'Complete payment for school applications',
    category: 'application',
    dueDate: subMonths(intakeDate, 6),
    priority: 'medium',
    completed: false,
    order: 5,
  })

  // 6. Receive Acceptance Letter (3-4 months before)
  milestones.push({
    title: 'Receive Letter of Acceptance',
    description: 'Get LOA from your chosen institution',
    category: 'application',
    dueDate: subMonths(intakeDate, 4),
    priority: 'high',
    completed: false,
    order: 6,
  })

  // 7. Prepare Financial Documents (3-4 months before)
  milestones.push({
    title: 'Prepare Financial Proof',
    description: 'Bank statements, GIC, sponsorship letters',
    category: 'visa',
    dueDate: subMonths(intakeDate, 4),
    priority: 'high',
    completed: false,
    order: 7,
  })

  // 8. Apply for Study Permit (3 months before)
  milestones.push({
    title: 'Submit Study Permit Application',
    description: 'Apply online through IRCC portal',
    category: 'visa',
    dueDate: subMonths(intakeDate, 3),
    priority: 'high',
    completed: false,
    order: 8,
  })

  // 9. Pay Visa Application Fee (3 months before)
  milestones.push({
    title: 'Pay Study Permit Fee',
    description: 'CAD $150 application fee',
    category: 'visa',
    dueDate: subMonths(intakeDate, 3),
    priority: 'high',
    completed: false,
    order: 9,
  })

  // 10. Book Biometrics Appointment (2.5 months before)
  milestones.push({
    title: 'Complete Biometrics',
    description: 'Fingerprints and photo at VAC/ASC',
    category: 'visa',
    dueDate: subMonths(intakeDate, 2.5),
    priority: 'high',
    completed: false,
    order: 10,
  })

  // 11. Medical Exam (2 months before)
  milestones.push({
    title: 'Medical Examination',
    description: 'Complete medical exam with panel physician',
    category: 'visa',
    dueDate: subMonths(intakeDate, 2),
    priority: 'medium',
    completed: false,
    order: 11,
  })

  // 12. Police Certificate (2 months before)
  milestones.push({
    title: 'Obtain Police Certificate',
    description: 'Get police clearance if required',
    category: 'visa',
    dueDate: subMonths(intakeDate, 2),
    priority: 'medium',
    completed: false,
    order: 12,
  })

  // 13. Receive Visa Decision (1 month before)
  milestones.push({
    title: 'Receive Study Permit Approval',
    description: 'Get passport back with visa',
    category: 'visa',
    dueDate: subMonths(intakeDate, 1),
    priority: 'high',
    completed: false,
    order: 13,
  })

  // 14. Book Flights (4 weeks before)
  milestones.push({
    title: 'Book Flight to Canada',
    description: 'Purchase one-way or return ticket',
    category: 'preparation',
    dueDate: subWeeks(intakeDate, 4),
    priority: 'high',
    completed: false,
    order: 14,
  })

  // 15. Find Accommodation (3 weeks before)
  milestones.push({
    title: 'Secure Housing',
    description: 'Book temporary or permanent accommodation',
    category: 'preparation',
    dueDate: subWeeks(intakeDate, 3),
    priority: 'high',
    completed: false,
    order: 15,
  })

  // 16. Prepare Documents for POE (2 weeks before)
  milestones.push({
    title: 'Prepare Port of Entry Documents',
    description: 'LOA, passport, financial proof, study permit letter',
    category: 'preparation',
    dueDate: subWeeks(intakeDate, 2),
    priority: 'high',
    completed: false,
    order: 16,
  })

  // 17. Pack & Prepare (1 week before)
  milestones.push({
    title: 'Pack for Travel',
    description: 'Pack essentials, winter clothes, documents',
    category: 'preparation',
    dueDate: subWeeks(intakeDate, 1),
    priority: 'medium',
    completed: false,
    order: 17,
  })

  // 18. Arrive in Canada (5 days before)
  milestones.push({
    title: 'Arrive in Canada',
    description: 'Travel to Canada and complete border formalities',
    category: 'arrival',
    dueDate: subWeeks(intakeDate, 1),
    priority: 'high',
    completed: false,
    order: 18,
  })

  // 19. Orientation & Registration (1 day before intake)
  milestones.push({
    title: 'Attend University Orientation',
    description: 'Register for classes, get student ID',
    category: 'arrival',
    dueDate: subWeeks(intakeDate, 0),
    priority: 'medium',
    completed: false,
    order: 19,
  })

  return milestones
}

/**
 * Calculate days until a date
 */
export function daysUntil(date: Date): number {
  return differenceInDays(date, new Date())
}

/**
 * Get status of a milestone
 */
export function getMilestoneStatus(milestone: TimelineMilestone): 'upcoming' | 'due-soon' | 'overdue' | 'completed' {
  if (milestone.completed) return 'completed'

  const days = daysUntil(milestone.dueDate)

  if (days < 0) return 'overdue'
  if (days <= 7) return 'due-soon'
  return 'upcoming'
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy')
}

/**
 * Get next milestone
 */
export function getNextMilestone(milestones: TimelineMilestone[]): TimelineMilestone | null {
  const upcoming = milestones
    .filter(m => !m.completed && daysUntil(m.dueDate) >= 0)
    .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))

  return upcoming[0] || null
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(milestones: TimelineMilestone[]): number {
  if (milestones.length === 0) return 0
  const completed = milestones.filter(m => m.completed).length
  return Math.round((completed / milestones.length) * 100)
}
