'use client'

import { useEffect } from 'react'
import { DocumentCard } from '@/components/visa/DocumentCard'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { DEFAULT_VISA_DOCUMENTS } from '@/data/constants'
import { AlertCircle } from 'lucide-react'

export default function VisaPage() {
  const visaDocuments = useStore((state) => state.visaDocuments)
  const addVisaDocument = useStore((state) => state.addVisaDocument)

  useEffect(() => {
    if (visaDocuments.length === 0) {
      DEFAULT_VISA_DOCUMENTS.forEach((doc) => {
        addVisaDocument({
          ...doc,
          id: Date.now().toString() + Math.random().toString(),
        })
      })
    }
  }, [])

  const stats = {
    total: visaDocuments.length,
    notStarted: visaDocuments.filter(d => d.status === 'not_started').length,
    inProgress: visaDocuments.filter(d => d.status === 'in_progress').length,
    submitted: visaDocuments.filter(d => d.status === 'submitted').length,
    approved: visaDocuments.filter(d => d.status === 'approved').length,
    required: visaDocuments.filter(d => d.required).length,
  }

  const progress = stats.total > 0
    ? ((stats.submitted + stats.approved) / stats.total) * 100
    : 0

  const requiredNotStarted = visaDocuments.filter(
    d => d.required && d.status === 'not_started'
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visa Documents</h1>
        <p className="text-muted-foreground">
          Track your study permit application documents
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Document Progress</CardTitle>
            <CardDescription>
              {stats.submitted + stats.approved} of {stats.total} documents completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Stats</CardTitle>
            <CardDescription>Overview of your documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Not Started:</span>
              <span className="font-medium">{stats.notStarted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">In Progress:</span>
              <span className="font-medium text-blue-600">{stats.inProgress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Submitted:</span>
              <span className="font-medium text-yellow-600">{stats.submitted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Approved:</span>
              <span className="font-medium text-green-600">{stats.approved}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {requiredNotStarted.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Required Documents Pending</CardTitle>
            </div>
            <CardDescription>
              You have {requiredNotStarted.length} required documents that haven&apos;t been started yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {requiredNotStarted.map((doc) => (
                <li key={doc.id} className="text-sm">{doc.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visaDocuments
            .filter(d => d.required)
            .map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
        </div>
      </div>

      {visaDocuments.some(d => !d.required) && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Optional Documents</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visaDocuments
              .filter(d => !d.required)
              .map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
