'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BookOpen, GraduationCap, FileText, DollarSign, Plane, AlertCircle } from 'lucide-react'

export default function InfoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Information Hub</h1>
        <p className="text-muted-foreground">
          Everything you need to know about studying in Canada
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle>Study Permit Process Overview</CardTitle>
              </div>
              <CardDescription>Understanding the Canadian study permit application journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">What is a Study Permit?</h3>
                <p className="text-sm text-muted-foreground">
                  A study permit is a document issued by Immigration, Refugees and Citizenship Canada (IRCC)
                  that allows foreign nationals to study at designated learning institutions (DLIs) in Canada.
                  Most international students need a study permit to study in Canada.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Requirements</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Letter of Acceptance from a Designated Learning Institution (DLI)</li>
                  <li>Proof of financial support (tuition + living expenses)</li>
                  <li>Valid passport</li>
                  <li>No criminal record</li>
                  <li>Medical exam (if required)</li>
                  <li>Letter of explanation/Statement of Purpose</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Processing Time</h3>
                <p className="text-sm text-muted-foreground">
                  Processing times vary by country but typically range from 4-16 weeks. Apply as early as possible,
                  ideally 3-4 months before your program starts. Check current processing times for your country
                  on the IRCC website.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline Overview</CardTitle>
              <CardDescription>Typical timeline for the study permit process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Badge className="bg-blue-500">Months 1-3</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Research & Apply to Schools</p>
                    <p className="text-xs text-muted-foreground">Research programs, prepare documents, take language tests</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Badge className="bg-green-500">Months 3-5</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Receive LOA & Prepare Documents</p>
                    <p className="text-xs text-muted-foreground">Get acceptance letter, gather financial documents</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Badge className="bg-yellow-500">Months 5-7</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Submit Study Permit Application</p>
                    <p className="text-xs text-muted-foreground">Complete biometrics, medical exam, submit application</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Badge className="bg-purple-500">Months 7-9</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Approval & Travel Prep</p>
                    <p className="text-xs text-muted-foreground">Receive approval, book flights, arrange accommodation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                <CardTitle>Choosing Schools & Programs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Designated Learning Institutions (DLIs)</h3>
                <p className="text-sm text-muted-foreground">
                  Only apply to schools with a DLI number. These are government-approved institutions.
                  You can search for DLIs on the IRCC website.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Popular Provinces for International Students</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li><strong>Ontario:</strong> Toronto, Ottawa, Waterloo - Tech hub, diverse cities</li>
                  <li><strong>British Columbia:</strong> Vancouver, Victoria - Mild climate, west coast living</li>
                  <li><strong>Quebec:</strong> Montreal - French culture, affordable tuition</li>
                  <li><strong>Alberta:</strong> Calgary, Edmonton - Lower cost of living, oil & gas industry</li>
                  <li><strong>Nova Scotia:</strong> Halifax - Maritime culture, growing tech scene</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Application Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Apply to 3-5 schools to increase your chances</li>
                  <li>Check program-specific requirements carefully</li>
                  <li>Prepare strong academic transcripts and recommendation letters</li>
                  <li>Take language tests early (IELTS, TOEFL, PTE)</li>
                  <li>Apply before deadlines (usually Jan-Mar for Fall intake)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Required Documents Guide</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Letter of Acceptance (LOA)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The most important document. Must include:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>School&apos;s DLI number</li>
                  <li>Program name and duration</li>
                  <li>Tuition fees</li>
                  <li>Start date</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Proof of Financial Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Must show you can afford tuition + living expenses:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Bank statements (last 4-6 months)</li>
                  <li>GIC (Guaranteed Investment Certificate) - CAD 20,635</li>
                  <li>Proof of paid tuition</li>
                  <li>Scholarship letters</li>
                  <li>Sponsor affidavit (if sponsored)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Statement of Purpose (SOP)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  A letter explaining your study plans. Include:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Why you chose this program and school</li>
                  <li>How it aligns with your career goals</li>
                  <li>Your ties to your home country</li>
                  <li>Your plan to return home after studies</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Biometrics</h3>
                <p className="text-sm text-muted-foreground">
                  Fingerprints and photo at a Visa Application Centre (VAC). Fee: CAD 85.
                  Must be done within 30 days of receiving the biometrics instruction letter.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Medical Exam</h3>
                <p className="text-sm text-muted-foreground">
                  Required for students from certain countries or programs over 6 months.
                  Must be done by a panel physician approved by IRCC.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <CardTitle>Financial Planning Guide</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Typical Costs (CAD per year)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Undergraduate Tuition:</span>
                    <span className="font-medium">$29,000 - $40,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Postgraduate Tuition:</span>
                    <span className="font-medium">$35,000 - $50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Living Expenses:</span>
                    <span className="font-medium">$15,000 - $20,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Books & Supplies:</span>
                    <span className="font-medium">$1,500 - $3,000</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Application Fees</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">School Application:</span>
                    <span className="font-medium">$100 - $250 per school</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Study Permit:</span>
                    <span className="font-medium">$235</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biometrics:</span>
                    <span className="font-medium">$85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medical Exam:</span>
                    <span className="font-medium">$200 - $450</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Guaranteed Investment Certificate (GIC)</h3>
                <p className="text-sm text-muted-foreground">
                  Many students use GIC programs from Canadian banks (Scotia, CIBC, ICICI).
                  You invest CAD 20,635 which is released monthly for living expenses.
                  It serves as proof of funds and makes your application stronger.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Working While Studying</h3>
                <p className="text-sm text-muted-foreground">
                  International students can work up to 24 hours/week during school terms
                  and full-time during breaks. Typical wages: $15-20/hour.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <CardTitle>Common Mistakes to Avoid</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-destructive font-bold">✗</span>
                  <div>
                    <strong>Incomplete financial documents:</strong> Show clear proof of funds for full program duration
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive font-bold">✗</span>
                  <div>
                    <strong>Weak Statement of Purpose:</strong> Be specific about your goals and ties to home country
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive font-bold">✗</span>
                  <div>
                    <strong>Applying too late:</strong> Start at least 6 months before your program begins
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive font-bold">✗</span>
                  <div>
                    <strong>Not checking DLI status:</strong> Only schools on the DLI list qualify for study permits
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive font-bold">✗</span>
                  <div>
                    <strong>Ignoring biometrics deadline:</strong> Complete within 30 days of instruction letter
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Apply early:</strong> Don&apos;t wait for the deadline, apply as soon as you have your LOA
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Be honest:</strong> Don&apos;t hide travel history or refusals, explain them clearly
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Organize documents:</strong> Label everything clearly and provide translations if needed
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Show strong ties:</strong> Demonstrate reasons to return home (job, family, property)
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Join communities:</strong> Connect with other applicants and students on forums and social media
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
