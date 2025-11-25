import type { VisaDocument, ChecklistItem } from '@/types'

export const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
]

export const DEFAULT_VISA_DOCUMENTS: Omit<VisaDocument, 'id'>[] = [
  {
    name: "Letter of Acceptance (LOA)",
    description: "Official letter from a Designated Learning Institution (DLI)",
    status: "not_started",
    required: true,
  },
  {
    name: "Proof of Identity (Passport)",
    description: "Valid passport for the duration of your stay",
    status: "not_started",
    required: true,
  },
  {
    name: "Proof of Financial Support",
    description: "Bank statements, GIC, scholarship letters showing you can support yourself",
    status: "not_started",
    required: true,
  },
  {
    name: "Biometrics",
    description: "Fingerprints and photo at a VAC or ASC",
    status: "not_started",
    required: true,
  },
  {
    name: "Medical Exam",
    description: "Completed by panel physician if required",
    status: "not_started",
    required: true,
  },
  {
    name: "Statement of Purpose (SOP)",
    description: "Letter explaining your study plans and intentions",
    status: "not_started",
    required: true,
  },
  {
    name: "Language Test Results",
    description: "IELTS, TOEFL, PTE, or other approved language test",
    status: "not_started",
    required: true,
  },
  {
    name: "Police Certificate",
    description: "If you've lived in another country for 6+ months since age 18",
    status: "not_started",
    required: false,
  },
  {
    name: "Academic Documents",
    description: "Transcripts, diplomas, degrees",
    status: "not_started",
    required: true,
  },
]

export const POE_CHECKLIST: ChecklistItem[] = [
  {
    id: "poe-1",
    category: "Essential Documents",
    title: "Valid Passport",
    description: "Your passport must be valid for the entire duration of your stay",
    completed: false,
  },
  {
    id: "poe-2",
    category: "Essential Documents",
    title: "Study Permit Approval Letter",
    description: "Port of Entry Letter of Introduction from IRCC",
    completed: false,
  },
  {
    id: "poe-3",
    category: "Essential Documents",
    title: "Letter of Acceptance (LOA)",
    description: "Original or copy from your DLI",
    completed: false,
  },
  {
    id: "poe-4",
    category: "Essential Documents",
    title: "Proof of Financial Support",
    description: "Bank statements, GIC confirmation, scholarship letters",
    completed: false,
  },
  {
    id: "poe-5",
    category: "Accommodation",
    title: "Proof of Accommodation",
    description: "Residence letter, hotel booking, or host address",
    completed: false,
  },
  {
    id: "poe-6",
    category: "Health",
    title: "Medical Exam Results",
    description: "If applicable, bring your medical exam documentation",
    completed: false,
  },
]

export const FIRST_WEEK_CHECKLIST: ChecklistItem[] = [
  {
    id: "fw-1",
    category: "Government",
    title: "Apply for SIN",
    description: "Social Insurance Number - needed for work and benefits",
    completed: false,
    link: "https://www.canada.ca/en/employment-social-development/services/sin.html"
  },
  {
    id: "fw-2",
    category: "Banking",
    title: "Open a Bank Account",
    description: "Major banks: RBC, TD, Scotia, BMO, CIBC",
    completed: false,
  },
  {
    id: "fw-3",
    category: "Mobile",
    title: "Get a Phone Plan",
    description: "Carriers: Rogers, Bell, Telus, Fido, Freedom Mobile",
    completed: false,
  },
  {
    id: "fw-4",
    category: "Health",
    title: "Apply for Health Card",
    description: "Provincial health insurance (varies by province)",
    completed: false,
  },
  {
    id: "fw-5",
    category: "Transportation",
    title: "Get Public Transit Pass",
    description: "Presto (ON), Compass (BC), or local transit card",
    completed: false,
  },
  {
    id: "fw-6",
    category: "School",
    title: "Attend Orientation",
    description: "International student orientation at your school",
    completed: false,
  },
]

export const FINANCIAL_REQUIREMENTS = {
  gic: 20635,
  livingExpensesPerYear: 15000,
  tuitionAverage: 35000,
  applicationFee: 150,
  visaFee: 235,
  biometricsFee: 85,
}
