import { roundToCents } from './price'

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function valueToPercent(
  value: number,
  min: number,
  max: number,
): number {
  if (min === max) {
    return 0
  }
  const percent = ((value - min) / (max - min)) * 100
  return clampValue(percent, 0, 100)
}

export function percentToValue(
  percent: number,
  min: number,
  max: number,
): number {
  const clampedPercent = clampValue(percent, 0, 100)
  return roundToCents(min + (clampedPercent / 100) * (max - min))
}

export function indexToPercent(index: number, count: number): number {
  if (count <= 1) {
    return 0
  }
  const percent = (index / (count - 1)) * 100
  return clampValue(percent, 0, 100)
}

export function percentToIndex(percent: number, count: number): number {
  if (count <= 1) {
    return 0
  }
  const clampedPercent = clampValue(percent, 0, 100)
  const index = (clampedPercent / 100) * (count - 1)
  return Math.round(index)
}
