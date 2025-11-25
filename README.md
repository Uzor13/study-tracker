# CanStudy Tracker - Complete Visa Application Management Platform

A comprehensive, production-ready web application to track and manage visa applications for Canada and beyond. Built with modern technologies including Next.js 16, Prisma, PostgreSQL, NextAuth.js, and Resend for email notifications.

## ✨ What's New in v2.0

- 🔐 **User Authentication** - Secure login/register with NextAuth.js
- 🗄️ **PostgreSQL Database** - Persistent data storage with Prisma ORM
- 📧 **Email Notifications** - Automated reminders and updates via Resend
- 🌍 **Multi-Visa Support** - Extensible for Study Permits, Work Permits, PR, Tourist Visas
- 🎨 **Enhanced Design** - Beautiful UI with Inter font and gradient backgrounds
- 🔔 **Notification System** - Deadline reminders and status updates
- 📊 **Advanced Analytics** - Track progress across all visa categories

## Features

### 📚 School Application Tracker
- Add and track multiple university applications
- Monitor application status (not started, in progress, submitted, accepted, rejected, waitlisted)
- Track deadlines, tuition fees, and application fees
- View statistics on all your applications

### 📄 Visa Documents Checklist
- Pre-populated checklist of all required documents
- Track document status (not started, in progress, submitted, approved)
- Separate required and optional documents
- Progress tracking and alerts for pending required documents

### 💰 Financial Planner
- Track all expenses (application fees, visa fees, tuition, living expenses, etc.)
- Budget calculator with estimated costs for studying in Canada
- Mark expenses as paid/unpaid
- Category-wise expense breakdown
- GIC and proof of funds information

### 📅 Timeline Visualization
- Chronological view of all important dates
- Upcoming deadlines and overdue items
- Visual timeline with status indicators
- Reference guide for typical study permit timeline

### 📖 Information Hub
- Comprehensive guides about the Canadian study permit process
- Province-specific information
- Document requirements explained in detail
- Financial planning tips
- Common mistakes and pro tips

### ✈️ Post-Arrival Tools
- Port of Entry (POE) checklist
- First week essentials checklist
- Flight and travel tips
- Information about major Canadian airports
- Guidance on SIN, health card, bank account, etc.

### 📊 Dashboard
- Overview of all progress
- Statistics on applications, documents, and finances
- Upcoming deadlines at a glance
- Quick action buttons
- Progress indicators

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js v5
- **Email:** Resend
- **Styling:** Tailwind CSS 4 + Inter Font
- **UI Components:** Radix UI with custom shadcn/ui components
- **Icons:** Lucide React
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation & Setup

#### 1. Clone and Install

```bash
git clone <your-repo>
cd visa-application
npm install
```

#### 2. Database Setup

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (if not already installed)
# macOS
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb canstudy_tracker
```

**Option B: Cloud PostgreSQL (Recommended)**

Use any of these providers for a free PostgreSQL database:
- [Supabase](https://supabase.com) - Free tier with 500MB
- [Neon](https://neon.tech) - Serverless Postgres
- [Railway](https://railway.app) - Free tier available
- [Vercel Postgres](https://vercel.com/postgres) - Integrated with Vercel

#### 3. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.local .env
```

Edit `.env` with your configuration:

```env
# Database - Get this from your PostgreSQL provider
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth - Generate with: openssl rand -base64 32
AUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Resend (for emails) - Get API key from https://resend.com
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="CanStudy Tracker <noreply@yourdomain.com>"
```

#### 4. Database Migration & Seeding

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Seed initial data (visa categories, document templates)
npm run db:seed
```

#### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you'll be redirected to the login page.

#### 6. Create Your First Account

Navigate to `/auth/register` or click "Create one" on the login page to create your account.

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Database Management

```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Generate Prisma Client after schema changes
npm run db:generate

# Create a migration (for production)
npx prisma migrate dev --name your_migration_name
```

## Project Structure

```
visa-application/
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── register/        # User registration
│   │   ├── applications/    # CRUD for applications
│   │   ├── documents/       # Document management
│   │   └── finances/        # Financial tracking
│   ├── auth/                # Auth pages (login/register)
│   ├── applications/        # School applications
│   ├── finances/            # Financial tracker
│   ├── visa/                # Visa documents
│   ├── timeline/            # Timeline view
│   ├── info/                # Information hub
│   ├── post-arrival/        # Post-arrival guide
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # Base UI components
│   ├── auth/                # Auth components
│   ├── dashboard/           # Dashboard components
│   ├── applications/        # Application components
│   ├── visa/                # Visa components
│   ├── finance/             # Finance components
│   └── providers/           # Context providers
├── lib/
│   ├── prisma.ts            # Prisma client
│   ├── auth.ts              # NextAuth configuration
│   ├── email.ts             # Email utilities
│   └── utils.ts             # Helper functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
└── types/                   # TypeScript definitions
```

## Extensibility: Supporting Multiple Visa Categories

The platform is designed to be easily extensible to support different visa types:

### Current Supported Categories

1. **Study Permit** 🎓 - Complete tracking for student visas
2. **Work Permit** 💼 - Employment-based visas
3. **Permanent Resident** 🏠 - PR applications
4. **Tourist Visa** ✈️ - Visitor visas

### Adding a New Visa Category

1. **Add to Database** (via Prisma Studio or seed script):
```typescript
await prisma.visaCategory.create({
  data: {
    name: "Spousal Sponsorship",
    slug: "spousal-sponsorship",
    description: "Family sponsorship for spouses",
    country: "Canada",
    icon: "💑",
    active: true,
  },
})
```

2. **Create Document Templates**:
```typescript
await prisma.documentTemplate.createMany({
  data: [
    {
      visaCategoryId: "category-id",
      name: "Marriage Certificate",
      description: "Official marriage certificate",
      required: true,
      category: "family",
      order: 1,
    },
    // Add more documents...
  ],
})
```

3. **Update UI**: The platform will automatically list the new category in the visa selector.

### Database Schema Design

The schema uses a flexible approach:
- `VisaCategory` - Defines different visa types
- `VisaProfile` - User's specific visa application
- `DocumentTemplate` - Pre-defined documents per category
- `Document` - User's actual documents
- `Application` - Schools/employers (extensible)
- `Finance` - All expenses
- `Timeline` - Events and deadlines
- `Notification` - Email reminders

## Key Features

### 🔐 Authentication
- Secure user registration and login
- Session management with NextAuth.js
- Password hashing with bcrypt

### 📧 Email Notifications
- Welcome emails on registration
- Deadline reminders (configurable days before)
- Status update notifications
- Built with Resend API

### 💾 Data Persistence
- PostgreSQL database for reliability
- Prisma ORM for type-safe database access
- Automatic timestamps and soft deletes

### 🎨 Modern UI
- Inter font for clean typography
- Gradient backgrounds
- Smooth animations
- Fully responsive design
- Dark mode ready

### 📊 Analytics
- Progress tracking across all categories
- Expense summaries
- Deadline tracking
- Visual timelines

## Email Configuration

The platform uses [Resend](https://resend.com) for transactional emails:

1. Sign up at resend.com
2. Verify your domain (or use their test domain)
3. Get your API key
4. Add to `.env`:
```env
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="CanStudy <noreply@yourdomain.com>"
```

Email templates are in `lib/email.ts` and can be customized.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will automatically:
- Build your Next.js app
- Set up serverless functions
- Provide a PostgreSQL database (optional)

### Other Platforms

Compatible with:
- Railway
- Render
- DigitalOcean App Platform
- AWS (EC2, Elastic Beanstalk)
- Any Node.js hosting

## Future Roadmap

- [ ] Document upload to cloud storage (S3/Cloudflare R2)
- [ ] Real-time IRCC processing times integration
- [ ] Multi-language support (FR, ES, ZH)
- [ ] Mobile app (React Native)
- [ ] Community forum
- [ ] AI-powered document review
- [ ] Calendar sync (Google/Outlook)
- [ ] Export to PDF
- [ ] WhatsApp notifications

## Disclaimer

This tool is for informational and organizational purposes only. Always refer to official Government of Canada (IRCC) resources for the most up-to-date immigration requirements and procedures.

## Resources

- [IRCC Official Website](https://www.canada.ca/en/immigration-refugees-citizenship.html)
- [Study Permit Requirements](https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html)
- [Designated Learning Institutions List](https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html)
