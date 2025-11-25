# Quick Setup Guide

## ⚡ 5-Minute Setup

### 1. Get a PostgreSQL Database (Free)

Choose one of these free options:

**Neon (Recommended - Easiest)**
```
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Copy the connection string
```

**Supabase**
```
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the URI (not transaction)
```

### 2. Get Resend API Key (Optional - For Emails)

```
1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Create API Key
4. Copy the key
```

### 3. Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env and add:
DATABASE_URL="your-postgresql-url-here"
AUTH_SECRET="run: openssl rand -base64 32"
RESEND_API_KEY="your-resend-key" # Optional
```

### 4. Setup Database

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data (visa categories, documents)
npm run db:seed
```

### 5. Run the App

```bash
npm run dev
```

Visit http://localhost:3000 and create your account!

## 🎯 What You Get

After setup, you'll have:

✅ User authentication (login/register)
✅ 4 visa categories (Study, Work, PR, Tourist)
✅ Pre-populated document templates
✅ Complete tracking system
✅ Email notifications (if configured)

## 🔧 Troubleshooting

### Database Connection Errors

```bash
# Test your database connection
npx prisma db pull

# If it works, you're good!
# If not, check your DATABASE_URL
```

### Prisma Generate Errors

```bash
# Clear Prisma cache
rm -rf node_modules/.prisma
npm run db:generate
```

### Port Already in Use

```bash
# Next.js will auto-select another port
# Or kill the process using port 3000:
lsof -ti:3000 | xargs kill
```

## 📊 View Your Database

```bash
# Open Prisma Studio (visual database editor)
npm run db:studio
```

This opens a browser at http://localhost:5555 where you can:
- View all your data
- Add/edit/delete records
- Test queries

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 2. Go to vercel.com
# 3. Import your repo
# 4. Add environment variables
# 5. Deploy!
```

## 📧 Email Setup (Optional)

If you skip email setup:
- Registration still works
- You just won't receive welcome emails or reminders
- Add it later when ready

To enable:
1. Get Resend API key (free)
2. Add to .env
3. Restart dev server

## 🎨 Customization

### Change App Name
Edit `app/layout.tsx`:
```typescript
title: "Your App Name"
```

### Add More Visa Categories
Edit `prisma/seed.ts` and run:
```bash
npm run db:seed
```

### Customize Email Templates
Edit `lib/email.ts`

## Need Help?

- Check the main README.md
- Open an issue on GitHub
- Review Prisma docs: https://prisma.io/docs
- NextAuth docs: https://next-auth.js.org
