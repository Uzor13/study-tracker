'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, DollarSign, Trash2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { School, ApplicationStatus } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

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
}

export function SchoolCard({ school }: SchoolCardProps) {
  const updateSchool = useStore((state) => state.updateSchool)
  const deleteSchool = useStore((state) => state.deleteSchool)

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    updateSchool(school.id, { status: newStatus })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{school.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{school.program}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteSchool(school.id)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{school.location.city}, {school.location.province}</span>
          <Badge variant="outline" className="ml-2">
            {school.level}
          </Badge>
        </div>

        {school.applicationDeadline && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Deadline: {formatDate(school.applicationDeadline)}</span>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          {school.applicationFee > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>App Fee: {formatCurrency(school.applicationFee)}</span>
            </div>
          )}
          {school.tuitionFee > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Tuition: {formatCurrency(school.tuitionFee)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium">Application Status</label>
          <select
            value={school.status}
            onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
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
