'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { POE_CHECKLIST, FIRST_WEEK_CHECKLIST } from '@/data/constants'
import { Plane, CheckCircle2, MapPin, Home } from 'lucide-react'
import type { ChecklistItem } from '@/types'

export default function PostArrivalPage() {
  const [poeChecklist, setPoeChecklist] = useState<ChecklistItem[]>(POE_CHECKLIST)
  const [firstWeekChecklist, setFirstWeekChecklist] = useState<ChecklistItem[]>(FIRST_WEEK_CHECKLIST)

  const togglePoeItem = (id: string) => {
    setPoeChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const toggleFirstWeekItem = (id: string) => {
    setFirstWeekChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const poeProgress = (poeChecklist.filter(i => i.completed).length / poeChecklist.length) * 100
  const firstWeekProgress = (firstWeekChecklist.filter(i => i.completed).length / firstWeekChecklist.length) * 100

  const groupedPoeItems = poeChecklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  const groupedFirstWeekItems = firstWeekChecklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Post-Arrival Guide</h1>
        <p className="text-muted-foreground">
          Everything you need to do when you arrive in Canada
        </p>
      </div>

      <Tabs defaultValue="poe" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="poe">Port of Entry</TabsTrigger>
          <TabsTrigger value="first-week">First Week</TabsTrigger>
          <TabsTrigger value="tips">Travel Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="poe" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    <CardTitle>Port of Entry Checklist</CardTitle>
                  </div>
                  <CardDescription>Documents needed when you land in Canada</CardDescription>
                </div>
                <Badge variant={poeProgress === 100 ? "default" : "outline"}>
                  {poeChecklist.filter(i => i.completed).length} / {poeChecklist.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={poeProgress} className="mb-4" />
            </CardContent>
          </Card>

          {Object.entries(groupedPoeItems).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => togglePoeItem(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>What Happens at Port of Entry?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>1. Immigration Officer Interview:</strong>
                <p className="text-muted-foreground">You&apos;ll speak with an immigration officer who will verify your documents and ask questions about your study plans.</p>
              </div>
              <div>
                <strong>2. Document Verification:</strong>
                <p className="text-muted-foreground">They&apos;ll check your passport, approval letter, LOA, and proof of funds.</p>
              </div>
              <div>
                <strong>3. Study Permit Issuance:</strong>
                <p className="text-muted-foreground">If everything is in order, you&apos;ll receive your actual study permit (the paper you had before was just an approval).</p>
              </div>
              <div>
                <strong>4. Customs Declaration:</strong>
                <p className="text-muted-foreground">Declare any goods you&apos;re bringing and collect your luggage.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="first-week" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    <CardTitle>First Week Checklist</CardTitle>
                  </div>
                  <CardDescription>Essential tasks to complete in your first week</CardDescription>
                </div>
                <Badge variant={firstWeekProgress === 100 ? "default" : "outline"}>
                  {firstWeekChecklist.filter(i => i.completed).length} / {firstWeekChecklist.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={firstWeekProgress} className="mb-4" />
            </CardContent>
          </Card>

          {Object.entries(groupedFirstWeekItems).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleFirstWeekItem(item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                          Learn more →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Priority Order Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge>Day 1-2</Badge>
                <span>SIM card, temporary accommodation, register at school</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Day 3-5</Badge>
                <span>Apply for SIN, open bank account, get health card</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Week 2-4</Badge>
                <span>Find permanent housing, get transit pass, explore area</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flight & Travel Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Before You Fly</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Book flights 2-3 months in advance for better prices</li>
                  <li>Arrive 1-2 weeks before classes start to settle in</li>
                  <li>Print all important documents (don&apos;t rely only on digital copies)</li>
                  <li>Pack study permit documents in carry-on, never check them</li>
                  <li>Bring CAD 300-500 in cash for immediate expenses</li>
                  <li>Download offline maps of your destination city</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What to Pack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Winter clothing (if arriving in fall/winter)</li>
                  <li>All original documents and certified copies</li>
                  <li>Prescription medications with doctor&apos;s note</li>
                  <li>Electrical adapters (Canada uses 120V, Type A/B plugs)</li>
                  <li>Laptop, phone, and chargers</li>
                  <li>Some comfort items from home</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Money Matters</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Notify your home bank about travel to avoid card blocks</li>
                  <li>Consider getting a Wise or Revolut card for better exchange rates</li>
                  <li>Keep emergency contact numbers for your bank</li>
                  <li>Budget CAD 2,000-3,000 for first month expenses</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Major Canadian Airports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <strong>Toronto Pearson (YYZ)</strong> - Ontario&apos;s main hub, serves most destinations
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <strong>Vancouver International (YVR)</strong> - BC&apos;s main airport, west coast gateway
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <strong>Montreal-Trudeau (YUL)</strong> - Quebec&apos;s largest, French/English services
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <strong>Calgary International (YYC)</strong> - Alberta hub, connects to western Canada
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
