'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'
import { formatDate, calculateDaysUntil } from '@/lib/utils'
import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export default function TimelinePage() {
  const schools = useStore((state) => state.schools)
  const finances = useStore((state) => state.finances)

  const events = [
    ...schools
      .filter(s => s.applicationDeadline)
      .map(s => {
        const daysUntil = calculateDaysUntil(s.applicationDeadline)
        return {
          date: s.applicationDeadline,
          title: `${s.name} Application Deadline`,
          description: s.program,
          type: 'application' as const,
          status: s.status === 'submitted' || s.status === 'accepted' ? 'completed' :
                  daysUntil < 0 ? 'overdue' : 'upcoming',
        }
      }),
    ...schools
      .filter(s => s.decisionDate)
      .map(s => ({
        date: s.decisionDate!,
        title: `${s.name} Decision`,
        description: `Status: ${s.status}`,
        type: 'milestone' as const,
        status: 'completed' as const,
      })),
    ...finances
      .filter(f => f.dueDate)
      .map(f => {
        const daysUntil = calculateDaysUntil(f.dueDate!)
        return {
          date: f.dueDate!,
          title: f.description,
          description: `Amount: $${f.amount} ${f.currency}`,
          type: 'finance' as const,
          status: f.paid ? 'completed' : daysUntil < 0 ? 'overdue' : 'upcoming',
        }
      }),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const upcomingEvents = events.filter(e => e.status === 'upcoming')
  const completedEvents = events.filter(e => e.status === 'completed')
  const overdueEvents = events.filter(e => e.status === 'overdue')

  const statusConfig = {
    upcoming: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Upcoming' },
    completed: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Completed' },
    overdue: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Overdue' },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="text-muted-foreground">
          Visualize your journey with important dates and milestones
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedEvents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueEvents.length}</div>
          </CardContent>
        </Card>
      </div>

      {events.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Events Yet</CardTitle>
            <CardDescription>
              Add school applications and expenses with due dates to see your timeline
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Timeline</CardTitle>
            <CardDescription>All important dates in chronological order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {events.map((event, index) => {
                const config = statusConfig[event.status]
                const Icon = config.icon
                const daysUntil = calculateDaysUntil(event.date)
                const isLast = index === events.length - 1

                return (
                  <div key={index} className="relative">
                    {!isLast && (
                      <div className="absolute left-5 top-10 h-full w-0.5 bg-border" />
                    )}
                    <div className="flex gap-4">
                      <div className={`relative flex h-10 w-10 items-center justify-center rounded-full ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 space-y-1 pb-8">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.title}</p>
                          <Badge
                            variant={event.status === 'completed' ? 'default' : event.status === 'overdue' ? 'destructive' : 'outline'}
                          >
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          {event.status === 'upcoming' && (
                            <span className="text-blue-600">
                              {daysUntil} days remaining
                            </span>
                          )}
                          {event.status === 'overdue' && (
                            <span className="text-red-600">
                              {Math.abs(daysUntil)} days overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Typical Study Permit Timeline</CardTitle>
          <CardDescription>Reference guide for planning your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Badge className="bg-purple-500">Months 1-3</Badge>
              <div>
                <p className="text-sm font-medium">Research & School Applications</p>
                <p className="text-xs text-muted-foreground">
                  Research programs, prepare documents, take language tests, submit applications
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge className="bg-blue-500">Months 3-5</Badge>
              <div>
                <p className="text-sm font-medium">Await Decisions & Prepare</p>
                <p className="text-xs text-muted-foreground">
                  Receive LOAs, gather financial documents, prepare SOP
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge className="bg-yellow-500">Months 5-7</Badge>
              <div>
                <p className="text-sm font-medium">Study Permit Application</p>
                <p className="text-xs text-muted-foreground">
                  Submit study permit, complete biometrics, medical exam
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge className="bg-green-500">Months 7-9</Badge>
              <div>
                <p className="text-sm font-medium">Approval & Travel Prep</p>
                <p className="text-xs text-muted-foreground">
                  Receive approval, book flights, arrange accommodation, prepare for departure
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
