'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/store/useStore'

export function ProgressOverview() {
  const schools = useStore((state) => state.schools)
  const visaDocuments = useStore((state) => state.visaDocuments)
  const finances = useStore((state) => state.finances)

  const schoolsProgress = schools.length > 0
    ? (schools.filter(s => s.status === 'accepted').length / schools.length) * 100
    : 0

  const docsProgress = visaDocuments.length > 0
    ? (visaDocuments.filter(d => d.status === 'approved' || d.status === 'submitted').length / visaDocuments.length) * 100
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
      </CardContent>
    </Card>
  )
}
