export type ApplicationStatus = "not_started" | "in_progress" | "submitted" | "accepted" | "rejected" | "waitlisted"
export type DocumentStatus = "not_started" | "in_progress" | "submitted" | "approved" | "rejected"
export type VisaStatus = "not_started" | "in_progress" | "submitted" | "biometrics_done" | "medical_done" | "approved" | "rejected"

export interface School {
  id: string
  name: string
  program: string
  level: "undergraduate" | "postgraduate" | "masters" | "phd"
  location: {
    city: string
    province: string
  }
  applicationDeadline: string
  status: ApplicationStatus
  applicationFee: number
  tuitionFee: number
  appliedDate?: string
  decisionDate?: string
  notes?: string
}

export interface VisaDocument {
  id: string
  name: string
  description: string
  status: DocumentStatus
  required: boolean
  uploadedDate?: string
  expiryDate?: string
  fileUrl?: string
  notes?: string
}

export interface FinanceItem {
  id: string
  category: "application_fee" | "visa_fee" | "tuition" | "living_expenses" | "travel" | "insurance" | "other"
  description: string
  amount: number
  currency: string
  paid: boolean
  dueDate?: string
  paidDate?: string
}

export interface TimelineEvent {
  id: string
  title: string
  date: string
  type: "application" | "visa" | "finance" | "travel" | "milestone"
  status: "upcoming" | "completed" | "overdue"
  description?: string
}

export interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  completed: boolean
  link?: string
}

export interface UserProgress {
  applicationsSubmitted: number
  documentsCompleted: number
  totalExpenses: number
  visaStatus: VisaStatus
  overallProgress: number
}
