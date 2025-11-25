'use client'

import { AddSchoolDialog } from '@/components/applications/AddSchoolDialog'
import { SchoolCard } from '@/components/applications/SchoolCard'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApplicationsPage() {
  const schools = useStore((state) => state.schools)

  const stats = {
    total: schools.length,
    notStarted: schools.filter(s => s.status === 'not_started').length,
    inProgress: schools.filter(s => s.status === 'in_progress').length,
    submitted: schools.filter(s => s.status === 'submitted').length,
    accepted: schools.filter(s => s.status === 'accepted').length,
    rejected: schools.filter(s => s.status === 'rejected').length,
    waitlisted: schools.filter(s => s.status === 'waitlisted').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Applications</h1>
          <p className="text-muted-foreground">
            Track all your Canadian university applications
          </p>
        </div>
        <AddSchoolDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
      </div>

      {schools.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Applications Yet</CardTitle>
            <CardDescription>
              Start by adding your first school application to track your progress
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      )}
    </div>
  )
}
