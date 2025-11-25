import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  // Create document templates for Study Permit
  const studyPermitDocs = [
    {
      name: 'Letter of Acceptance (LOA)',
      description: 'Official letter from a Designated Learning Institution (DLI)',
      required: true,
      category: 'educational',
      order: 1,
    },
    {
      name: 'Proof of Identity (Passport)',
      description: 'Valid passport for the duration of your stay',
      required: true,
      category: 'identity',
      order: 2,
    },
    {
      name: 'Proof of Financial Support',
      description: 'Bank statements, GIC, scholarship letters showing you can support yourself',
      required: true,
      category: 'financial',
      order: 3,
    },
    {
      name: 'Biometrics',
      description: 'Fingerprints and photo at a VAC or ASC',
      required: true,
      category: 'identity',
      order: 4,
    },
    {
      name: 'Medical Exam',
      description: 'Completed by panel physician if required',
      required: true,
      category: 'medical',
      order: 5,
    },
    {
      name: 'Statement of Purpose (SOP)',
      description: 'Letter explaining your study plans and intentions',
      required: true,
      category: 'educational',
      order: 6,
    },
    {
      name: 'Language Test Results',
      description: 'IELTS, TOEFL, PTE, or other approved language test',
      required: true,
      category: 'educational',
      order: 7,
    },
    {
      name: 'Police Certificate',
      description: "If you've lived in another country for 6+ months since age 18",
      required: false,
      category: 'identity',
      order: 8,
    },
    {
      name: 'Academic Documents',
      description: 'Transcripts, diplomas, degrees',
      required: true,
      category: 'educational',
      order: 9,
    },
  ]

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
