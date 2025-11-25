'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Trash2, DollarSign } from 'lucide-react'
import type { FinanceItem } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

const categoryLabels = {
  application_fee: 'Application Fee',
  visa_fee: 'Visa Fee',
  tuition: 'Tuition',
  living_expenses: 'Living Expenses',
  travel: 'Travel',
  insurance: 'Insurance',
  other: 'Other',
}

interface ExpenseCardProps {
  expense: FinanceItem
  onUpdate: () => void
  onDelete: () => void
}

export function ExpenseCard({ expense, onUpdate, onDelete }: ExpenseCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const togglePaid = async () => {
    setIsUpdating(true)
    const newPaidStatus = !expense.paid

    try {
      const response = await fetch('/api/finances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: expense.id,
          paid: newPaidStatus,
          paidDate: newPaidStatus ? new Date().toISOString() : null,
        }),
      })

      if (response.ok) {
        onUpdate() // Notify parent to refresh
      } else {
        console.error('Failed to update expense')
      }
    } catch (error) {
      console.error('Error updating expense:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/finances?id=${expense.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete() // Notify parent to refresh
      } else {
        console.error('Failed to delete expense')
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className={expense.paid ? 'opacity-60' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={expense.paid}
              onCheckedChange={togglePaid}
              disabled={isUpdating}
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <div>
                <p className={`font-medium ${expense.paid ? 'line-through' : ''}`}>
                  {expense.description}
                </p>
                <Badge variant="outline" className="mt-1">
                  {categoryLabels[expense.category]}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">{formatCurrency(expense.amount, expense.currency)}</span>
              </div>

              {expense.dueDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {formatDate(expense.dueDate)}</span>
                </div>
              )}

              {expense.paid && expense.paidDate && (
                <div className="text-sm text-green-600">
                  Paid on {formatDate(expense.paidDate)}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
