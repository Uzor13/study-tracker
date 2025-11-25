
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
  console.log('🌱 Seeding database...')

  // Create visa categories
  const studyPermit = await prisma.visaCategory.upsert({
    where: { slug: 'study-permit' },
    update: {},
    create: {
      name: 'Study Permit',
      slug: 'study-permit',
      description: 'Canadian Study Permit for international students',
      country: 'Canada',
      icon: '🎓',
      active: true,
    },
  })

  const workPermit = await prisma.visaCategory.upsert({
    where: { slug: 'work-permit' },
    update: {},
    create: {
      name: 'Work Permit',
      slug: 'work-permit',
      description: 'Canadian Work Permit for foreign workers',
      country: 'Canada',
      icon: '💼',
      active: true,
    },
  })

  const permanentResident = await prisma.visaCategory.upsert({
    where: { slug: 'permanent-resident' },
    update: {},
    create: {
      name: 'Permanent Resident',
      slug: 'permanent-resident',
      description: 'Canadian Permanent Residence application',
      country: 'Canada',
      icon: '🏠',
      active: true,
    },
  })

  const touristVisa = await prisma.visaCategory.upsert({
    where: { slug: 'tourist-visa' },
    update: {},
    create: {
      name: 'Tourist Visa',
      slug: 'tourist-visa',
      description: 'Canadian Tourist/Visitor Visa',
      country: 'Canada',
      icon: '✈️',
      active: true,
    },
  })

  console.log('✅ Created visa categories')

  // Create document templates for Study Permit (degree-specific)
  const studyPermitDocs = [
    // Common documents for all degree types
    {
      name: 'Letter of Acceptance (LOA)',
      description: 'Official letter from a Designated Learning Institution (DLI)',
      required: true,
      category: 'educational',
      order: 1,
      forUndergrad: true,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'Proof of Identity (Passport)',
      description: 'Valid passport for the duration of your stay',
      required: true,
      category: 'identity',
      order: 2,
      forUndergrad: true,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'Proof of Financial Support',
      description: 'Bank statements, GIC, scholarship letters showing you can support yourself',
      required: true,
      category: 'financial',
      order: 3,
      forUndergrad: true,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'Biometrics',
      description: 'Fingerprints and photo at a VAC or ASC',
      required: true,
      category: 'identity',
      order: 4,
      forUndergrad: true,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'Medical Exam',
      description: 'Completed by panel physician if required',
      required: true,
      category: 'medical',
      order: 5,
      forUndergrad: true,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'Statement of Purpose (SOP)',
      description: 'Letter explaining your study plans and career goals',
      required: true,
      category: 'educational',
      order: 6,
      forUndergrad: true,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'Language Test Results',
      description: 'IELTS, TOEFL, PTE, or other approved language test',
      required: true,
      category: 'educational',
      order: 7,
      forUndergrad: true,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'Police Certificate',
      description: "If you've lived in another country for 6+ months since age 18",
      required: false,
      category: 'identity',
      order: 8,
      forUndergrad: true,
      forMasters: true,
      forPhd: true,
    },

    // Undergraduate-specific documents
    {
      name: 'High School Transcripts',
      description: 'Official transcripts from secondary school',
      required: true,
      category: 'educational',
      order: 9,
      forUndergrad: true,
      forMasters: false,
      forPhd: false,
    },
    {
      name: 'High School Diploma',
      description: 'Secondary school completion certificate',
      required: true,
      category: 'educational',
      order: 10,
      forUndergrad: true,
      forMasters: false,
      forPhd: false,
    },
    {
      name: 'SAT/ACT Scores (if applicable)',
      description: 'Standardized test scores for US-style admissions',
      required: false,
      category: 'educational',
      order: 11,
      forUndergrad: true,
      forMasters: false,
      forPhd: false,
    },

    // Masters-specific documents
    {
      name: 'Bachelor\'s Degree Certificate',
      description: 'Proof of completed undergraduate degree',
      required: true,
      category: 'educational',
      order: 9,
      forUndergrad: false,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'University Transcripts',
      description: 'Official transcripts from undergraduate studies',
      required: true,
      category: 'educational',
      order: 10,
      forUndergrad: false,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'Letters of Recommendation',
      description: '2-3 academic reference letters from professors',
      required: true,
      category: 'educational',
      order: 11,
      forUndergrad: false,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'Resume/CV',
      description: 'Academic and professional curriculum vitae',
      required: true,
      category: 'educational',
      order: 12,
      forUndergrad: false,
      forMasters: true,
      forPhd: true,
    },
    {
      name: 'GRE/GMAT Scores (if required)',
      description: 'Graduate school entrance exam scores',
      required: false,
      category: 'educational',
      order: 13,
      forUndergrad: false,
      forMasters: true,
      forPhd: false,
    },
    {
      name: 'Work Experience Letters',
      description: 'Professional experience documentation (if applicable)',
      required: false,
      category: 'employment',
      order: 14,
      forUndergrad: false,
      forMasters: true,
      forPhd: false,
    },

    // PhD-specific documents
    {
      name: 'Master\'s Degree Certificate',
      description: 'Proof of completed graduate degree',
      required: true,
      category: 'educational',
      order: 15,
      forUndergrad: false,
      forMasters: false,
      forPhd: true,
    },
    {
      name: 'Master\'s Thesis',
      description: 'Copy of completed master\'s thesis or major research paper',
      required: true,
      category: 'educational',
      order: 16,
      forUndergrad: false,
      forMasters: false,
      forPhd: true,
    },
    {
      name: 'Research Proposal',
      description: 'Detailed proposal for doctoral research',
      required: true,
      category: 'educational',
      order: 17,
      forUndergrad: false,
      forMasters: false,
      forPhd: true,
    },
    {
      name: 'Publications List',
      description: 'List of academic publications (if any)',
      required: false,
      category: 'educational',
      order: 18,
      forUndergrad: false,
      forMasters: false,
      forPhd: true,
    },
    {
      name: 'Supervisor Acceptance Letter',
      description: 'Letter from potential PhD supervisor confirming acceptance',
      required: true,
      category: 'educational',
      order: 19,
      forUndergrad: false,
      forMasters: false,
      forPhd: true,
    },
    {
      name: 'Writing Sample',
      description: 'Academic writing sample demonstrating research ability',
      required: true,
      category: 'educational',
      order: 20,
      forUndergrad: false,
      forMasters: false,
      forPhd: true,
    },
  ]

  // Clear existing document templates to avoid duplicates
  await prisma.documentTemplate.deleteMany({
    where: { visaCategoryId: studyPermit.id }
  })

  for (const doc of studyPermitDocs) {
    await prisma.documentTemplate.create({
      data: {
        ...doc,
        visaCategoryId: studyPermit.id,
      },
    })
  }

  console.log('✅ Created document templates for Study Permit')

  // Create document templates for Work Permit
  const workPermitDocs = [
    {
      name: 'Job Offer Letter',
      description: 'Valid job offer from a Canadian employer',
      required: true,
      category: 'employment',
      order: 1,
    },
    {
      name: 'LMIA (Labour Market Impact Assessment)',
      description: 'Approved LMIA from your employer (if required)',
      required: true,
      category: 'employment',
      order: 2,
    },
    {
      name: 'Proof of Identity (Passport)',
      description: 'Valid passport',
      required: true,
      category: 'identity',
      order: 3,
    },
    {
      name: 'Proof of Work Experience',
      description: 'Resume, reference letters, employment records',
      required: true,
      category: 'employment',
      order: 4,
    },
    {
      name: 'Educational Credentials',
      description: 'Degrees, diplomas, certificates',
      required: false,
      category: 'educational',
      order: 5,
    },
  ]

  for (const doc of workPermitDocs) {
    await prisma.documentTemplate.create({
      data: {
        ...doc,
        visaCategoryId: workPermit.id,
      },
    })
  }

  console.log('✅ Created document templates for Work Permit')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
