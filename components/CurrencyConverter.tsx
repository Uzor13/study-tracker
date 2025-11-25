'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ArrowLeftRight } from 'lucide-react'
import { Button } from './ui/button'

interface ExchangeRates {
  CAD: number
  USD: number
  NGN: number
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('1000')
  const [fromCurrency, setFromCurrency] = useState<'CAD' | 'USD' | 'NGN'>('NGN')
  const [toCurrency, setToCurrency] = useState<'CAD' | 'USD' | 'NGN'>('CAD')
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [converted, setConverted] = useState<number>(0)

  useEffect(() => {
    fetchRates()
  }, [])

  useEffect(() => {
    if (rates && amount) {
      calculateConversion()
    }
  }, [amount, fromCurrency, toCurrency, rates])

  const fetchRates = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/currency')
      const data = await response.json()
      setRates(data.rates)
    } catch (error) {
      console.error('Error fetching rates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateConversion = () => {
    if (!rates || !amount) return

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return

    let result = numAmount

    // Convert to CAD first
    if (fromCurrency !== 'CAD') {
      result = numAmount / rates[fromCurrency]
    }

    // Convert from CAD to target
    if (toCurrency !== 'CAD') {
      result = result * rates[toCurrency]
    }

    setConverted(result)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const formatCurrency = (value: number, currency: 'CAD' | 'USD' | 'NGN'): string => {
    const symbols = { CAD: 'CA$', USD: '$', NGN: '₦' }
    return `${symbols[currency]}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const currencyOptions = [
    { value: 'NGN', label: '🇳🇬 Nigerian Naira (NGN)', symbol: '₦' },
    { value: 'USD', label: '🇺🇸 US Dollar (USD)', symbol: '$' },
    { value: 'CAD', label: '🇨🇦 Canadian Dollar (CAD)', symbol: 'CA$' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between Nigerian Naira, US Dollar, and Canadian Dollar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Currency */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg font-semibold"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <select
              id="from"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as 'CAD' | 'USD' | 'NGN')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {currencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <select
              id="to"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as 'CAD' | 'USD' | 'NGN')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {currencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={swapCurrencies}
            className="rounded-full"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Result */}
        <div className="p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Converted Amount</p>
          <p className="text-3xl font-bold text-primary">
            {isLoading ? '...' : formatCurrency(converted, toCurrency)}
          </p>
        </div>

        {/* Exchange Rates */}
        {rates && (
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p className="font-medium mb-2">Current Exchange Rates (Base: CAD)</p>
            <p>1 CAD = {rates.USD.toFixed(4)} USD</p>
            <p>1 CAD = {rates.NGN.toFixed(2)} NGN</p>
            <p>1 USD = {(rates.NGN / rates.USD).toFixed(2)} NGN</p>
            <p className="text-[10px] mt-2 italic">Rates updated hourly</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
