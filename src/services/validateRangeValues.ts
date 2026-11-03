import type { RangeValues } from '@/types/range'

export function assertRangeValues(data: unknown): asserts data is RangeValues {
  if (
    typeof data !== 'object' ||
    data === null ||
    !Array.isArray((data as RangeValues).rangeValues)
  ) {
    throw new Error('rangeValues must be an array')
  }

  if ((data as RangeValues).rangeValues.length < 2) {
    throw new Error('rangeValues must contain at least two values')
  }

  if (
    (data as RangeValues).rangeValues.some(
      (value) => typeof value !== 'number' || !Number.isFinite(value),
    )
  ) {
    throw new Error('rangeValues must contain only finite numbers')
  }

  if ((data as RangeValues).rangeValues.some((value) => value < 0)) {
    throw new Error('rangeValues must not be negative')
  }

  if (
    (data as RangeValues).rangeValues.some((value, index, array) => {
      return index > 0 && value <= array[index - 1]
    })
  ) {
    throw new Error('rangeValues must be in strictly ascending order')
  }
}
