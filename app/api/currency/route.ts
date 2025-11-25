import { NextResponse } from 'next/server'
import { convertCurrency, EXCHANGE_RATES } from '@/lib/currency'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const amount = parseFloat(searchParams.get('amount') || '0')
    const from = searchParams.get('from') || 'CAD'
    const to = searchParams.get('to') || 'CAD'

    // Use the static exchange rates from the currency lib
    const rates = EXCHANGE_RATES

    if (amount && from && to) {
      const converted = convertCurrency(amount, from, to)
      return NextResponse.json({
        amount,
        from,
        to,
        converted,
        rates,
      })
    }

    return NextResponse.json({ rates })
  } catch (error) {
    console.error('Currency conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    )
  }
}
