'use client'

import { AddExpenseDialog } from '@/components/finance/AddExpenseDialog'
import { ExpenseCard } from '@/components/finance/ExpenseCard'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { FINANCIAL_REQUIREMENTS } from '@/data/constants'
import { DollarSign, TrendingUp, Wallet, AlertCircle } from 'lucide-react'

export default function FinancesPage() {
  const finances = useStore((state) => state.finances)

  const totalExpenses = finances.reduce((sum, f) => sum + f.amount, 0)
  const paidExpenses = finances.filter(f => f.paid).reduce((sum, f) => sum + f.amount, 0)
  const pendingExpenses = finances.filter(f => !f.paid).reduce((sum, f) => sum + f.amount, 0)

  const categoryTotals = finances.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + f.amount
    return acc
  }, {} as Record<string, number>)

  const estimatedTotal =
    FINANCIAL_REQUIREMENTS.gic +
    FINANCIAL_REQUIREMENTS.tuitionAverage +
    FINANCIAL_REQUIREMENTS.applicationFee +
    FINANCIAL_REQUIREMENTS.visaFee +
    FINANCIAL_REQUIREMENTS.biometricsFee

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Tracker</h1>
          <p className="text-muted-foreground">
            Track your expenses and budget for studying in Canada
          </p>
        </div>
        <AddExpenseDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Wallet className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finances.length}</div>
            <p className="text-xs text-muted-foreground">
              {finances.filter(f => !f.paid).length} unpaid
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estimated Budget for Canada</CardTitle>
            <CardDescription>Typical costs for international students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GIC (Guaranteed Investment Certificate)</span>
              <span className="font-medium">{formatCurrency(FINANCIAL_REQUIREMENTS.gic)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average Annual Tuition</span>
              <span className="font-medium">{formatCurrency(FINANCIAL_REQUIREMENTS.tuitionAverage)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Study Permit Fee</span>
              <span className="font-medium">{formatCurrency(FINANCIAL_REQUIREMENTS.visaFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Biometrics Fee</span>
              <span className="font-medium">{formatCurrency(FINANCIAL_REQUIREMENTS.biometricsFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Application Fees (avg per school)</span>
              <span className="font-medium">{formatCurrency(FINANCIAL_REQUIREMENTS.applicationFee)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Estimated Total (First Year)</span>
              <span>{formatCurrency(estimatedTotal)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Your tracked expenses by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categoryTotals).length === 0 ? (
              <p className="text-sm text-muted-foreground">No expenses tracked yet</p>
            ) : (
              Object.entries(categoryTotals).map(([category, total]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {category.replace('_', ' ')}
                  </span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>
        {finances.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No Expenses Yet</CardTitle>
              <CardDescription>
                Start tracking your expenses to manage your budget effectively
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-3">
            {finances.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
