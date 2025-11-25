// Currency conversion utilities

// Exchange rates relative to CAD (Canadian Dollar as base)
// These should be updated periodically via an API in production
export const EXCHANGE_RATES: Record<string, number> = {
  CAD: 1.0,      // Base currency
  USD: 0.74,     // 1 CAD = 0.74 USD
  NGN: 1150.0,   // 1 CAD = 1150 NGN
  GBP: 0.58,     // 1 CAD = 0.58 GBP
  EUR: 0.68,     // 1 CAD = 0.68 EUR
  INR: 61.5,     // 1 CAD = 61.5 INR
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  CAD: 'CA$',
  USD: '$',
  NGN: '₦',
  GBP: '£',
  EUR: '€',
  INR: '₹',
}

export const CURRENCY_NAMES: Record<string, string> = {
  CAD: 'Canadian Dollar',
  USD: 'US Dollar',
  NGN: 'Nigerian Naira',
  GBP: 'British Pound',
  EUR: 'Euro',
  INR: 'Indian Rupee',
}

/**
 * Convert amount from one currency to another
 * @param amount Amount to convert
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount

  const fromRate = EXCHANGE_RATES[fromCurrency]
  const toRate = EXCHANGE_RATES[toCurrency]

  if (!fromRate || !toRate) {
    console.warn(`Exchange rate not found for ${fromCurrency} or ${toCurrency}`)
    return amount // Return original amount if conversion not possible
  }

  // Convert to CAD first, then to target currency
  const amountInCAD = amount / fromRate
  const convertedAmount = amountInCAD * toRate

  return convertedAmount
}

/**
 * Format currency with appropriate symbol
 * @param amount Amount to format
 * @param currency Currency code
 * @returns Formatted currency string
 */
export function formatCurrencyWithCode(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency

  // Format with appropriate decimals
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))

  return `${symbol}${formatted}`
}

/**
 * Get exchange rate between two currencies
 * @param fromCurrency Source currency
 * @param toCurrency Target currency
 * @returns Exchange rate
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return 1

  const fromRate = EXCHANGE_RATES[fromCurrency]
  const toRate = EXCHANGE_RATES[toCurrency]

  if (!fromRate || !toRate) return 1

  return toRate / fromRate
}
