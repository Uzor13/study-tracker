'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function ProgressOverview() {
  const [schools, setSchools] = useState<any[]>([])
  const [visaDocuments, setVisaDocuments] = useState<any[]>([])
  const [finances, setFinances] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [applicationsRes, documentsRes, financesRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/documents'),
        fetch('/api/finances'),
      ])

      if (applicationsRes.ok) {
        const data = await applicationsRes.json()
        setSchools(data.applications || [])
      }

      if (documentsRes.ok) {
        const data = await documentsRes.json()
        setVisaDocuments(data.documents || [])
      }

      if (financesRes.ok) {
        const data = await financesRes.json()
        setFinances(data.finances || [])
      }
    } catch (error) {
      console.error('Error fetching progress data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const schoolsProgress = schools.length > 0
    ? (schools.filter(s => s.status === 'submitted' || s.status === 'accepted').length / schools.length) * 100
    : 0

  const docsProgress = visaDocuments.length > 0
    ? (visaDocuments.filter(d => d.status === 'approved' || d.status === 'submitted' || (d.status === 'in_progress' && d.fileUrl)).length / visaDocuments.length) * 100
    : 0

  const financesProgress = finances.length > 0
    ? (finances.filter(f => f.paid).length / finances.length) * 100
    : 0

  const overallProgress = (schoolsProgress + docsProgress + financesProgress) / 3

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Progress</CardTitle>
        <CardDescription>Track your journey to studying in Canada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading progress...</div>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">School Applications</span>
                  <span className="text-sm text-muted-foreground">{Math.round(schoolsProgress)}%</span>
                </div>
                <Progress value={schoolsProgress} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Visa Documents</span>
                  <span className="text-sm text-muted-foreground">{Math.round(docsProgress)}%</span>
                </div>
                <Progress value={docsProgress} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Financial Obligations</span>
                  <span className="text-sm text-muted-foreground">{Math.round(financesProgress)}%</span>
                </div>
                <Progress value={financesProgress} />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
