import type { RangeLimits, RangeValues } from '@/types/range'
import { assertRangeLimits } from './validateRangeLimits'
import { assertRangeValues } from './validateRangeValues'

function getApiBaseUrl(): string {
  const cleanUrl = process.env.API_BASE_URL?.trim().replace(/\/+$/, '')
  return cleanUrl || 'http://localhost:8080'
}
async function fetchFromApi<T>(
  endpoint: string,
  errorMessage: string,
  assertValidate: (data: unknown) => asserts data is T,
): Promise<T> {
  const apiBaseUrl = getApiBaseUrl()
  const response = await fetch(`${apiBaseUrl}${endpoint}`)
  if (!response.ok) {
    throw new Error(`${errorMessage}. Status: ${response.status}`)
  }
  const data = await response.json()
  assertValidate(data)
  return data
}

export async function getRangeLimits(): Promise<RangeLimits> {
  return fetchFromApi<RangeLimits>(
    '/api/range/limits',
    'Could not load range limits',
    assertRangeLimits,
  )
}

export async function getRangeValues(): Promise<RangeValues> {
  return fetchFromApi<RangeValues>(
    '/api/range/values',
    'Could not load range values',
    assertRangeValues,
  )
}
