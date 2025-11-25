'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, DollarSign, Trash2 } from 'lucide-react'
import type { School, ApplicationStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const statusColors = {
  not_started: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  submitted: 'bg-yellow-500',
  accepted: 'bg-green-500',
  rejected: 'bg-red-500',
  waitlisted: 'bg-orange-500',
}

const statusLabels = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
}

interface SchoolCardProps {
  school: School
  onUpdate: () => void
  onDelete: () => void
}

export function SchoolCard({ school, onUpdate, onDelete }: SchoolCardProps) {
  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: school.id,
          status: newStatus,
        }),
      })

      if (response.ok) {
        toast.success('Application status updated')
        onUpdate()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      const response = await fetch(`/api/applications?id=${school.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Application deleted')
        onDelete()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete application')
      }
    } catch (error) {
      console.error('Error deleting application:', error)
      toast.error('Failed to delete application')
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="break-words">{school.name}</CardTitle>
            <p className="text-sm text-muted-foreground break-words">{school.program}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-destructive flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="break-words">{school.location.city}, {school.location.province}</span>
          </div>
          <Badge variant="outline">
            {school.level}
          </Badge>
        </div>

        {school.applicationDeadline && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="break-words">Deadline: {formatDate(school.applicationDeadline)}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
          {school.applicationFee > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>App Fee: {formatCurrency(school.applicationFee)}</span>
            </div>
          )}
          {school.tuitionFee > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>Tuition: {formatCurrency(school.tuitionFee)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 flex-1">
          <label className="text-sm font-medium">Application Status</label>
          <select
            value={school.status}
            onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Badge className={statusColors[school.status]}>
            {statusLabels[school.status]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
