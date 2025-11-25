'use client'

import { useState, useEffect } from 'react'
import { AddExpenseDialog } from '@/components/finance/AddExpenseDialog'
import { ExpenseCard } from '@/components/finance/ExpenseCard'
import { CurrencyConverter } from '@/components/CurrencyConverter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { convertCurrency, formatCurrencyWithCode } from '@/lib/currency'
import { FINANCIAL_REQUIREMENTS } from '@/data/constants'
import { DollarSign, TrendingUp, Wallet, AlertCircle } from 'lucide-react'
import type { FinanceItem } from '@/types'

export default function FinancesPage() {
  const [finances, setFinances] = useState<FinanceItem[]>([])
  const [defaultCurrency, setDefaultCurrency] = useState('CAD')
  const [isLoading, setIsLoading] = useState(true)

  // Load finances and user profile from database
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [financesRes, profileRes] = await Promise.all([
        fetch('/api/finances'),
        fetch('/api/profile'),
      ])

      if (financesRes.ok) {
        const data = await financesRes.json()
        // Convert database format to FinanceItem format
        const formattedFinances = data.finances.map((f: any) => ({
          id: f.id,
          category: f.category,
          description: f.description,
          amount: f.amount,
          currency: f.currency,
          paid: f.paid,
          dueDate: f.dueDate ? new Date(f.dueDate).toISOString().split('T')[0] : undefined,
          paidDate: f.paidDate ? new Date(f.paidDate).toISOString().split('T')[0] : undefined,
        }))
        setFinances(formattedFinances)
      }

      if (profileRes.ok) {
        const data = await profileRes.json()
        setDefaultCurrency(data.user.defaultCurrency || 'CAD')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFinances = async () => {
    await fetchData()
  }

  const handleFinanceAdded = () => {
    fetchFinances() // Reload finances after adding new one
  }

  const handleFinanceUpdated = () => {
    fetchFinances() // Reload finances after update
  }

  const handleFinanceDeleted = () => {
    fetchFinances() // Reload finances after deletion
  }

  // Convert all expenses to user's default currency
  const totalExpenses = finances.reduce((sum, f) => {
    const converted = convertCurrency(f.amount, f.currency, defaultCurrency)
    return sum + converted
  }, 0)

  const paidExpenses = finances
    .filter(f => f.paid)
    .reduce((sum, f) => {
      const converted = convertCurrency(f.amount, f.currency, defaultCurrency)
      return sum + converted
    }, 0)

  const pendingExpenses = finances
    .filter(f => !f.paid)
    .reduce((sum, f) => {
      const converted = convertCurrency(f.amount, f.currency, defaultCurrency)
      return sum + converted
    }, 0)

  const categoryTotals = finances.reduce((acc, f) => {
    const converted = convertCurrency(f.amount, f.currency, defaultCurrency)
    acc[f.category] = (acc[f.category] || 0) + converted
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Financial Tracker</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track your expenses and budget for studying in Canada
          </p>
        </div>
        <AddExpenseDialog onExpenseAdded={handleFinanceAdded} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyWithCode(totalExpenses, defaultCurrency)}</div>
            <p className="text-xs text-muted-foreground mt-1">in {defaultCurrency}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrencyWithCode(paidExpenses, defaultCurrency)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Wallet className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrencyWithCode(pendingExpenses, defaultCurrency)}</div>
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

      {/* Currency Converter */}
      <CurrencyConverter />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estimated Budget for Canada</CardTitle>
            <CardDescription>Typical costs for international students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GIC (Guaranteed Investment Certificate)</span>
              <span className="font-medium">{formatCurrencyWithCode(FINANCIAL_REQUIREMENTS.gic, 'CAD')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average Annual Tuition</span>
              <span className="font-medium">{formatCurrencyWithCode(FINANCIAL_REQUIREMENTS.tuitionAverage, 'CAD')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Study Permit Fee</span>
              <span className="font-medium">{formatCurrencyWithCode(FINANCIAL_REQUIREMENTS.visaFee, 'CAD')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Biometrics Fee</span>
              <span className="font-medium">{formatCurrencyWithCode(FINANCIAL_REQUIREMENTS.biometricsFee, 'CAD')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Application Fees (avg per school)</span>
              <span className="font-medium">{formatCurrencyWithCode(FINANCIAL_REQUIREMENTS.applicationFee, 'CAD')}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Estimated Total (First Year)</span>
              <span>{formatCurrencyWithCode(estimatedTotal, 'CAD')}</span>
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
                  <span className="font-medium">{formatCurrencyWithCode(total, defaultCurrency)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Loading expenses...</CardTitle>
            </CardHeader>
          </Card>
        ) : finances.length === 0 ? (
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
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onUpdate={handleFinanceUpdated}
                onDelete={handleFinanceDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
