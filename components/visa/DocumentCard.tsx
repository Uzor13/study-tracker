'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { FileCheck, FileX, Clock, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { VisaDocument, DocumentStatus } from '@/types'

const statusConfig = {
  not_started: { label: 'Not Started', color: 'bg-gray-500', icon: FileX },
  in_progress: { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-yellow-500', icon: FileCheck },
  approved: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-500', icon: FileX },
}

interface DocumentCardProps {
  document: VisaDocument
}

export function DocumentCard({ document }: DocumentCardProps) {
  const updateVisaDocument = useStore((state) => state.updateVisaDocument)

  const config = statusConfig[document.status]
  const Icon = config.icon

  const handleStatusChange = (newStatus: DocumentStatus) => {
    updateVisaDocument(document.id, { status: newStatus })
  }

  return (
    <Card className="relative">
      {document.required && (
        <div className="absolute top-3 right-3">
          <Badge variant="destructive" className="text-xs">Required</Badge>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-1 text-muted-foreground" />
          <div className="flex-1">
            <CardTitle className="text-base">{document.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{document.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            value={document.status}
            onChange={(e) => handleStatusChange(e.target.value as DocumentStatus)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            {Object.entries(statusConfig).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <Badge className={config.color}>
          {config.label}
        </Badge>
      </CardContent>
    </Card>
  )
}
