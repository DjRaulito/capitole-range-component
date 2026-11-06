import { clampValue } from './math'

export function clampHandleValue(
  handle: 'min' | 'max',
  value: number,
  selected: { min: number; max: number },
  limits: { min: number; max: number },
  minGap: number,
): number {
  const minLimit = limits.min
  const maxLimit = limits.max

  if (handle === 'min') {
    const maxValue = Math.max(selected.max - minGap, minLimit)
    return clampValue(value, minLimit, maxValue)
  }

  if (handle === 'max') {
    const minValue = selected.min + minGap
    return clampValue(value, minValue, maxLimit)
  }

  throw new Error(`Invalid handle type: ${handle}`)
}
