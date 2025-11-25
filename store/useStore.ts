import { create } from 'zustand'
import type { School, VisaDocument, FinanceItem, TimelineEvent, VisaStatus } from '@/types'

interface AppState {
  schools: School[]
  visaDocuments: VisaDocument[]
  finances: FinanceItem[]
  timeline: TimelineEvent[]
  visaStatus: VisaStatus

  addSchool: (school: School) => void
  updateSchool: (id: string, updates: Partial<School>) => void
  deleteSchool: (id: string) => void

  addVisaDocument: (doc: VisaDocument) => void
  updateVisaDocument: (id: string, updates: Partial<VisaDocument>) => void
  deleteVisaDocument: (id: string) => void

  addFinanceItem: (item: FinanceItem) => void
  updateFinanceItem: (id: string, updates: Partial<FinanceItem>) => void
  deleteFinanceItem: (id: string) => void

  addTimelineEvent: (event: TimelineEvent) => void
  updateTimelineEvent: (id: string, updates: Partial<TimelineEvent>) => void
  deleteTimelineEvent: (id: string) => void

  setVisaStatus: (status: VisaStatus) => void

  getTotalExpenses: () => number
  getProgressPercentage: () => number
}

// Simple Zustand store without persist (data will be in PostgreSQL)
export const useStore = create<AppState>()((set, get) => ({
  schools: [],
  visaDocuments: [],
  finances: [],
  timeline: [],
  visaStatus: 'not_started',

  addSchool: (school) => set((state) => ({ schools: [...state.schools, school] })),
  updateSchool: (id, updates) =>
    set((state) => ({
      schools: state.schools.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  deleteSchool: (id) =>
    set((state) => ({ schools: state.schools.filter((s) => s.id !== id) })),

  addVisaDocument: (doc) =>
    set((state) => ({ visaDocuments: [...state.visaDocuments, doc] })),
  updateVisaDocument: (id, updates) =>
    set((state) => ({
      visaDocuments: state.visaDocuments.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  deleteVisaDocument: (id) =>
    set((state) => ({ visaDocuments: state.visaDocuments.filter((d) => d.id !== id) })),

  addFinanceItem: (item) =>
    set((state) => ({ finances: [...state.finances, item] })),
  updateFinanceItem: (id, updates) =>
    set((state) => ({
      finances: state.finances.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  deleteFinanceItem: (id) =>
    set((state) => ({ finances: state.finances.filter((f) => f.id !== id) })),

  addTimelineEvent: (event) =>
    set((state) => ({ timeline: [...state.timeline, event] })),
  updateTimelineEvent: (id, updates) =>
    set((state) => ({
      timeline: state.timeline.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),
  deleteTimelineEvent: (id) =>
    set((state) => ({ timeline: state.timeline.filter((e) => e.id !== id) })),

  setVisaStatus: (status) => set({ visaStatus: status }),

  getTotalExpenses: () => {
    const state = get()
    return state.finances.reduce((sum, item) => sum + item.amount, 0)
  },

  getProgressPercentage: () => {
    const state = get()
    let completed = 0
    let total = 0

    total += state.schools.length
    completed += state.schools.filter((s) => s.status === 'accepted').length

    total += state.visaDocuments.length
    completed += state.visaDocuments.filter((d) => d.status === 'approved').length

    return total > 0 ? Math.round((completed / total) * 100) : 0
  },
}))
