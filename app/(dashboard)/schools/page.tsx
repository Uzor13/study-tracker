'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, GraduationCap, DollarSign, ExternalLink, Building2, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface School {
  id: string
  name: string
  type: string
  province: string
  city: string
  website: string | null
  ranking: number | null
  established: number | null
  international: boolean
  undergraduate: boolean
  masters: boolean
  phd: boolean
  tuitionUndergrad: number | null
  tuitionMasters: number | null
  tuitionPhd: number | null
  applicationFee: number | null
  description: string | null
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [filteredSchools, setFilteredSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedProvince, setSelectedProvince] = useState('all')
  const [selectedDegree, setSelectedDegree] = useState('all')
  const [sortBy, setSortBy] = useState('ranking')

  useEffect(() => {
    fetchSchools()
  }, [selectedType, selectedProvince, selectedDegree, sortBy])

  const fetchSchools = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        type: selectedType,
        province: selectedProvince,
        degreeType: selectedDegree,
        sort: sortBy,
      })

      const response = await fetch(`/api/schools?${params}`)
      const data = await response.json()
      setSchools(data.schools)
      setFilteredSchools(data.schools)
    } catch (error) {
      console.error('Error fetching schools:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSchools(filtered)
    } else {
      setFilteredSchools(schools)
    }
  }, [searchTerm, schools])

  const [addingApplication, setAddingApplication] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<string>('')

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 }).format(amount)
  }

  const handleAddToApplications = async (school: School, program: string) => {
    setAddingApplication(school.id)

    try {
      // Determine tuition based on program level
      let tuitionFee = 0
      if (program === 'undergraduate' && school.tuitionUndergrad) {
        tuitionFee = school.tuitionUndergrad
      } else if (program === 'masters' && school.tuitionMasters) {
        tuitionFee = school.tuitionMasters
      } else if (program === 'phd' && school.tuitionPhd) {
        tuitionFee = school.tuitionPhd
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionName: school.name,
          program: `${program.charAt(0).toUpperCase() + program.slice(1)} Program`,
          level: program,
          city: school.city,
          province: school.province,
          applicationFee: school.applicationFee || 0,
          tuitionFee,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Application added successfully!', {
          description: 'Check the Applications page to track your progress.',
        })
      } else {
        toast.error(data.error || 'Failed to add application')
      }
    } catch (error) {
      console.error('Error adding application:', error)
      toast.error('Failed to add application. Please try again.')
    } finally {
      setAddingApplication(null)
      setSelectedProgram('')
    }
  }

  const provinces = [...new Set(schools.map(s => s.province))].sort()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Canadian Schools</h1>
        <p className="text-muted-foreground">
          Explore {schools.length} universities, colleges, and polytechnics across Canada
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find the perfect school for your study abroad journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by school name, city, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="type">School Type</Label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Types</option>
                <option value="university">Universities</option>
                <option value="college">Colleges</option>
                <option value="polytechnic">Polytechnics</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <select
                id="province"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Provinces</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">Degree Type</Label>
              <select
                id="degree"
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Degrees</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="masters">Masters</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ranking">World Ranking</option>
                <option value="tuition">Tuition (Low to High)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSchools.length} of {schools.length} schools
        </p>
      </div>

      {/* Schools Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading schools...</p>
        </div>
      ) : filteredSchools.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No schools found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredSchools.map((school) => (
            <Card key={school.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{school.name}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="capitalize">
                        <Building2 className="h-3 w-3 mr-1" />
                        {school.type}
                      </Badge>
                      {school.ranking && (
                        <Badge variant="secondary">
                          QS Ranking: #{school.ranking}
                        </Badge>
                      )}
                      {school.established && (
                        <Badge variant="outline" className="text-xs">
                          Est. {school.established}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  {school.city}, {school.province}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {school.description}
                </p>

                {/* Programs Offered */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    Programs Offered:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {school.undergraduate && <Badge variant="outline">Undergraduate</Badge>}
                    {school.masters && <Badge variant="outline">Masters</Badge>}
                    {school.phd && <Badge variant="outline">PhD</Badge>}
                  </div>
                </div>

                {/* Tuition */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Annual Tuition (International):
                  </p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {school.undergraduate && school.tuitionUndergrad && (
                      <p>Undergraduate: {formatCurrency(school.tuitionUndergrad)}</p>
                    )}
                    {school.masters && school.tuitionMasters && (
                      <p>Masters: {formatCurrency(school.tuitionMasters)}</p>
                    )}
                    {school.phd && school.tuitionPhd && (
                      <p>PhD: {formatCurrency(school.tuitionPhd)}</p>
                    )}
                    {school.applicationFee && (
                      <p className="text-xs">Application Fee: {formatCurrency(school.applicationFee)}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {/* Program Selection Dropdown */}
                  {addingApplication === school.id ? (
                    <div className="flex flex-col gap-2 flex-1">
                      <select
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select program level...</option>
                        {school.undergraduate && <option value="undergraduate">Undergraduate</option>}
                        {school.masters && <option value="masters">Masters</option>}
                        {school.phd && <option value="phd">PhD</option>}
                      </select>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (selectedProgram) {
                              handleAddToApplications(school, selectedProgram)
                            } else {
                              toast.error('Please select a program level')
                            }
                          }}
                          disabled={!selectedProgram}
                          className="flex-1"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAddingApplication(null)
                            setSelectedProgram('')
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => setAddingApplication(school.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Apps
                      </Button>
                      {school.website && (
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <a href={school.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Website</span>
                            <span className="sm:hidden">Visit</span>
                          </a>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
