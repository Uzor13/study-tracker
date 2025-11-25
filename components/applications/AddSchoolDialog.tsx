'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { School, ApplicationStatus } from '@/types'

export function AddSchoolDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const addSchool = useStore((state) => state.addSchool)

  const [formData, setFormData] = useState({
    name: '',
    program: '',
    level: 'postgraduate' as School['level'],
    city: '',
    province: '',
    applicationDeadline: '',
    tuitionFee: '',
    applicationFee: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newSchool: School = {
      id: Date.now().toString(),
      name: formData.name,
      program: formData.program,
      level: formData.level,
      location: {
        city: formData.city,
        province: formData.province,
      },
      applicationDeadline: formData.applicationDeadline,
      status: 'not_started' as ApplicationStatus,
      applicationFee: parseFloat(formData.applicationFee) || 0,
      tuitionFee: parseFloat(formData.tuitionFee) || 0,
    }

    addSchool(newSchool)
    setIsOpen(false)
    setFormData({
      name: '',
      program: '',
      level: 'postgraduate',
      city: '',
      province: '',
      applicationDeadline: '',
      tuitionFee: '',
      applicationFee: '',
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add School
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-6 shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add School Application</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., University of Toronto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">Program *</Label>
            <Input
              id="program"
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              required
              placeholder="e.g., Computer Science"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <select
                id="level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as School['level'] })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                required
              >
                <option value="undergraduate">Undergraduate</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="masters">Masters</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Deadline</Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder="e.g., Toronto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                required
                placeholder="e.g., Ontario"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationFee">Application Fee (CAD)</Label>
              <Input
                id="applicationFee"
                type="number"
                value={formData.applicationFee}
                onChange={(e) => setFormData({ ...formData, applicationFee: e.target.value })}
                placeholder="150"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tuitionFee">Annual Tuition (CAD)</Label>
              <Input
                id="tuitionFee"
                type="number"
                value={formData.tuitionFee}
                onChange={(e) => setFormData({ ...formData, tuitionFee: e.target.value })}
                placeholder="35000"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add School</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
