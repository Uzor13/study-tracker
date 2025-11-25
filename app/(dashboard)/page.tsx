'use client'

import { GraduationCap, FileCheck, DollarSign, Calendar } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ProgressOverview } from '@/components/dashboard/ProgressOverview'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { formatCurrency, formatDate, calculateDaysUntil } from '@/lib/utils'
import Link from 'next/link'

export default function Home() {
  const schools = useStore((state) => state.schools)
  const visaDocuments = useStore((state) => state.visaDocuments)
  const finances = useStore((state) => state.finances)
  const getTotalExpenses = useStore((state) => state.getTotalExpenses)

  const acceptedSchools = schools.filter(s => s.status === 'accepted')
  const pendingApplications = schools.filter(s => s.status === 'in_progress' || s.status === 'submitted')
  const completedDocs = visaDocuments.filter(d => d.status === 'approved' || d.status === 'submitted')
  const totalExpenses = getTotalExpenses()
  const paidExpenses = finances.filter(f => f.paid).reduce((sum, f) => sum + f.amount, 0)

  const upcomingDeadlines = [
    ...schools
      .filter(s => s.applicationDeadline)
      .map(s => ({
        title: `${s.name} Application Deadline`,
        date: s.applicationDeadline,
        type: 'application' as const
      })),
    ...finances
      .filter(f => f.dueDate && !f.paid)
      .map(f => ({
        title: f.description,
        date: f.dueDate!,
        type: 'payment' as const
      }))
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your Canadian study permit application journey
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="School Applications"
          value={`${acceptedSchools.length}/${schools.length}`}
          description={`${pendingApplications.length} pending`}
          icon={GraduationCap}
        />
        <StatsCard
          title="Visa Documents"
          value={`${completedDocs.length}/${visaDocuments.length}`}
          description="Documents completed"
          icon={FileCheck}
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          description={`${formatCurrency(paidExpenses)} paid`}
          icon={DollarSign}
        />
        <StatsCard
          title="Upcoming Deadlines"
          value={upcomingDeadlines.length}
          description="Tasks due soon"
          icon={Calendar}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ProgressOverview />

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Stay on top of important dates</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => {
                  const daysUntil = calculateDaysUntil(deadline.date)
                  return (
                    <div key={index} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{deadline.title}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(deadline.date)}</p>
                      </div>
                      <Badge variant={daysUntil < 7 ? "destructive" : "outline"}>
                        {daysUntil < 0 ? 'Overdue' : `${daysUntil} days`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your application process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/applications">
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="mr-2 h-4 w-4" />
                Add School Application
              </Button>
            </Link>
            <Link href="/visa">
              <Button variant="outline" className="w-full justify-start">
                <FileCheck className="mr-2 h-4 w-4" />
                Update Visa Documents
              </Button>
            </Link>
            <Link href="/finances">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Track Expenses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {schools.length === 0 && visaDocuments.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Welcome to CanStudy Tracker!</CardTitle>
            <CardDescription>
              Let&apos;s get started with tracking your Canadian study permit application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Start by adding your school applications and setting up your visa document checklist.
              This will help you stay organized throughout your journey to studying in Canada.
            </p>
            <div className="flex gap-2 pt-4">
              <Link href="/applications">
                <Button>Add Your First School</Button>
              </Link>
              <Link href="/info">
                <Button variant="outline">Learn About the Process</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
