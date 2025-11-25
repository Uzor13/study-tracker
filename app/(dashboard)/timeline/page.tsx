'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Target,
  TrendingUp,
  Download
} from 'lucide-react'
import {
  generateTimeline,
  getIntakeDate,
  getMilestoneStatus,
  formatDate,
  daysUntil,
  getNextMilestone,
  calculateProgress,
  IntakeSeason,
  TimelineMilestone
} from '@/lib/timeline'

export default function TimelinePage() {
  const [intakeSeason, setIntakeSeason] = useState<IntakeSeason>('september')
  const [intakeYear, setIntakeYear] = useState<number>(new Date().getFullYear())
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([])
  const [showAll, setShowAll] = useState(true)
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set())

  // Load persisted milestone completion status
  useEffect(() => {
    fetchCompletedMilestones()
  }, [])

  // Generate milestones based on intake date
  useEffect(() => {
    const intakeDate = getIntakeDate(intakeSeason, intakeYear)
    const generated = generateTimeline(intakeDate)

    // Apply persisted completion status
    const updated = generated.map(m => ({
      ...m,
      completed: completedMilestones.has(m.title)
    }))

    setMilestones(updated)
  }, [intakeSeason, intakeYear, completedMilestones])

  const fetchCompletedMilestones = async () => {
    try {
      const response = await fetch('/api/timeline')
      if (response.ok) {
        const data = await response.json()
        const completed = new Set<string>(
          data.milestones
            .filter((m: any) => m.completed)
            .map((m: any) => m.title as string)
        )
        setCompletedMilestones(completed)
      }
    } catch (error) {
      console.error('Error fetching milestones:', error)
    }
  }

  const stats = {
    upcoming: milestones.filter(m => getMilestoneStatus(m) === 'upcoming' && !m.completed).length,
    dueSoon: milestones.filter(m => getMilestoneStatus(m) === 'due-soon').length,
    overdue: milestones.filter(m => getMilestoneStatus(m) === 'overdue').length,
    completed: milestones.filter(m => m.completed).length,
  }

  const nextMilestone = getNextMilestone(milestones)
  const progress = calculateProgress(milestones)

  const statusConfig = {
    upcoming: {
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      label: 'Upcoming'
    },
    'due-soon': {
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200',
      label: 'Due Soon'
    },
    overdue: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      label: 'Overdue'
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      label: 'Completed'
    },
  }

  const categoryColors = {
    application: 'bg-purple-500',
    visa: 'bg-blue-500',
    preparation: 'bg-yellow-500',
    arrival: 'bg-green-500',
  }

  const toggleMilestone = async (index: number) => {
    const milestone = milestones[index]
    const newCompletedStatus = !milestone.completed

    // Optimistically update UI
    const updated = [...milestones]
    updated[index].completed = newCompletedStatus
    setMilestones(updated)

    // Persist to database
    try {
      await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: milestone.title,
          description: milestone.description,
          date: milestone.dueDate.toISOString(),
          type: milestone.category,
          completed: newCompletedStatus,
        }),
      })

      // Update completed set
      const newCompleted = new Set(completedMilestones)
      if (newCompletedStatus) {
        newCompleted.add(milestone.title)
      } else {
        newCompleted.delete(milestone.title)
      }
      setCompletedMilestones(newCompleted)
    } catch (error) {
      console.error('Error saving milestone:', error)
      // Revert on error
      updated[index].completed = !newCompletedStatus
      setMilestones([...updated])
    }
  }

  const filteredMilestones = showAll
    ? milestones
    : milestones.filter(m => !m.completed || getMilestoneStatus(m) === 'overdue')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Smart Timeline
        </h1>
        <p className="text-muted-foreground">
          AI-powered timeline automatically generated based on your intake date
        </p>
      </div>

      {/* Intake Date Selector */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Your Target Intake
          </CardTitle>
          <CardDescription>
            Select when you plan to start your studies. Your timeline will auto-adjust!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="season">Intake Season</Label>
              <select
                id="season"
                value={intakeSeason}
                onChange={(e) => setIntakeSeason(e.target.value as IntakeSeason)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="september">🍂 September (Fall) - Main Intake</option>
                <option value="january">❄️ January (Winter) - Second Intake</option>
                <option value="may">🌸 May (Summer) - Limited Programs</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <select
                id="year"
                value={intakeYear}
                onChange={(e) => setIntakeYear(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                <option value={new Date().getFullYear() + 2}>{new Date().getFullYear() + 2}</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary mb-1">Target Start Date</p>
            <p className="text-2xl font-bold">{formatDate(getIntakeDate(intakeSeason, intakeYear))}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {daysUntil(getIntakeDate(intakeSeason, intakeYear))} days from now
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} of {milestones.length} completed
            </p>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">Tasks ahead</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.dueSoon}</div>
            <p className="text-xs text-muted-foreground">Within 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <Card className="border-2 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Next Milestone
            </CardTitle>
            <CardDescription>Your immediate focus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{nextMilestone.title}</h3>
                  <p className="text-sm text-muted-foreground">{nextMilestone.description}</p>
                </div>
                <Badge className={categoryColors[nextMilestone.category]}>
                  {nextMilestone.category}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(nextMilestone.dueDate)}</span>
                </div>
                <div className="flex items-center gap-1 text-primary font-medium">
                  <Clock className="h-4 w-4" />
                  <span>{daysUntil(nextMilestone.dueDate)} days remaining</span>
                </div>
              </div>
              <Button
                onClick={() => toggleMilestone(milestones.indexOf(nextMilestone))}
                size="sm"
                className="mt-2"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Complete Timeline</CardTitle>
              <CardDescription>19 milestones from start to finish</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showAll ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAll(true)}
              >
                Show All
              </Button>
              <Button
                variant={!showAll ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAll(false)}
              >
                Active Only
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMilestones.map((milestone, index) => {
              const status = getMilestoneStatus(milestone)
              const config = statusConfig[status]
              const Icon = config.icon
              const isLast = index === filteredMilestones.length - 1
              const days = daysUntil(milestone.dueDate)

              return (
                <div key={index} className={`relative border-l-4 ${config.borderColor} pl-6 pb-6`}>
                  {!isLast && (
                    <div className="absolute left-0 top-12 h-full w-0 border-l-2 border-dashed border-border" />
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.bgColor}`}>
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm ml-13">
                        <Badge variant="outline" className={categoryColors[milestone.category]}>
                          {milestone.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(milestone.dueDate)}</span>
                        </div>
                        {!milestone.completed && (
                          <div className={`flex items-center gap-1 font-medium ${
                            status === 'overdue' ? 'text-red-600' :
                            status === 'due-soon' ? 'text-orange-600' :
                            'text-blue-600'
                          }`}>
                            <Clock className="h-3 w-3" />
                            <span>
                              {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant={milestone.completed ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleMilestone(milestones.indexOf(milestone))}
                    >
                      {milestone.completed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Done
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Mark Done
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Download/Export */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Export Your Timeline</h4>
              <p className="text-sm text-muted-foreground">Download as PDF or add to calendar</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
