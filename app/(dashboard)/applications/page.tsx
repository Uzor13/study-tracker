'use client'

import { useState, useEffect } from 'react'
import { AddSchoolDialog } from '@/components/applications/AddSchoolDialog'
import { SchoolCard } from '@/components/applications/SchoolCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { School, ApplicationStatus } from '@/types'

interface Application {
  id: string
  institutionName: string
  program: string
  level: string
  city: string
  province: string
  status: string
  applicationFee: number
  tuitionFee: number
  applicationDeadline: Date | null
  appliedDate: Date | null
  decisionDate: Date | null
  notes: string | null
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = () => {
    fetchApplications() // Reload after update
  }

  const handleDelete = () => {
    fetchApplications() // Reload after delete
  }

  // Convert applications to school format for compatibility
  const schools = applications.map(app => ({
    id: app.id,
    name: app.institutionName,
    program: app.program,
    level: app.level as School['level'],
    location: {
      city: app.city,
      province: app.province,
    },
    status: app.status as ApplicationStatus,
    applicationFee: app.applicationFee,
    tuitionFee: app.tuitionFee,
    applicationDeadline: app.applicationDeadline ? new Date(app.applicationDeadline).toISOString() : '',
    appliedDate: app.appliedDate ? new Date(app.appliedDate).toISOString() : undefined,
    decisionDate: app.decisionDate ? new Date(app.decisionDate).toISOString() : undefined,
    notes: app.notes || undefined,
  }))

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">School Applications</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track all your Canadian university applications
          </p>
        </div>
        <AddSchoolDialog onApplicationAdded={handleUpdate} />
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

      {isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Loading applications...</CardTitle>
          </CardHeader>
        </Card>
      ) : schools.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Applications Yet</CardTitle>
            <CardDescription>
              Start by adding your first school application to track your progress or add schools from the Browse Schools page
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
