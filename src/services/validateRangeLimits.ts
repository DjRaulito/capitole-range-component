import type { RangeLimits } from '@/types/range'

export function assertRangeLimits(data: unknown): asserts data is RangeLimits {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('min' in data) ||
    typeof (data as RangeLimits).min !== 'number' ||
    !Number.isFinite((data as RangeLimits).min)
  ) {
    throw new Error('min must be a finite number')
  }

  if (
    !('max' in data) ||
    typeof (data as RangeLimits).max !== 'number' ||
    !Number.isFinite((data as RangeLimits).max)
  ) {
    throw new Error('max must be a finite number')
  }

  if ((data as RangeLimits).min < 0) {
    throw new Error('min must not be negative')
  }

  if ((data as RangeLimits).min >= (data as RangeLimits).max) {
    throw new Error('min must be lower than max')
  }
}
