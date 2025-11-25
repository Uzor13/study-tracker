'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Trash2, DollarSign } from 'lucide-react'
import { useStore } from '@/store/useStore'
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
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const updateFinanceItem = useStore((state) => state.updateFinanceItem)
  const deleteFinanceItem = useStore((state) => state.deleteFinanceItem)

  const togglePaid = () => {
    updateFinanceItem(expense.id, {
      paid: !expense.paid,
      paidDate: !expense.paid ? new Date().toISOString() : undefined,
    })
  }

  return (
    <Card className={expense.paid ? 'opacity-60' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={expense.paid}
              onCheckedChange={togglePaid}
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
            onClick={() => deleteFinanceItem(expense.id)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
