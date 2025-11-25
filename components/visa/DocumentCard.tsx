'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileCheck, FileX, Clock, CheckCircle2, Upload, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { DocumentStatus } from '@/types'

const statusConfig = {
  not_started: { label: 'Not Started', color: 'bg-gray-500', icon: FileX },
  in_progress: { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-yellow-500', icon: FileCheck },
  approved: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-500', icon: FileX },
}

interface DocumentCardProps {
  document: any
  onUpdate: () => void
}

export function DocumentCard({ document, onUpdate }: DocumentCardProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const config = statusConfig[document.status as DocumentStatus]
  const Icon = config.icon

  const handleStatusChange = async (newStatus: DocumentStatus) => {
    try {
      setIsUpdating(true)
      const response = await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: document.id, status: newStatus }),
      })

      if (response.ok) {
        toast.success('Document status updated')
        onUpdate()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentId', document.id)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('File uploaded successfully')
        onUpdate()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to upload file')
      }
    } catch (error) {
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteFile = async () => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: document.id,
          fileUrl: null,
          fileName: null,
          fileSize: null,
          fileType: null,
          uploadedDate: null,
        }),
      })

      if (response.ok) {
        toast.success('File deleted')
        onUpdate()
      } else {
        toast.error('Failed to delete file')
      }
    } catch (error) {
      toast.error('Failed to delete file')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Card className="relative h-full flex flex-col">
      {document.required && (
        <div className="absolute top-3 right-3">
          <Badge variant="destructive" className="text-xs">Required</Badge>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base break-words">{document.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1 break-words">{document.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <label className="text-sm font-medium">Status</label>
          <select
            value={document.status}
            onChange={(e) => handleStatusChange(e.target.value as DocumentStatus)}
            disabled={isUpdating}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm disabled:opacity-50"
          >
            {Object.entries(statusConfig).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>

          <Badge className={config.color}>
            {config.label}
          </Badge>
        </div>

        {/* File Upload Section */}
        <div className="space-y-2 border-t pt-4">
          <label className="text-sm font-medium">Document File</label>

          {document.fileUrl ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm break-all">
                <FileCheck className="h-4 w-4 flex-shrink-0 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{document.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {document.fileSize && formatFileSize(document.fileSize)}
                    {document.uploadedDate && ` • ${new Date(document.uploadedDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(document.fileUrl, '_blank')}
                  className="flex-1 sm:flex-initial"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteFile}
                  className="flex-1 sm:flex-initial"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="outline"
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, DOCX, JPG, PNG (max 10MB)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
