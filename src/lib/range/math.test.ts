import {
  clampValue,
  percentToValue,
  valueToPercent,
} from './math'

describe('clampValue', () => {
  it.each([
    { name: 'a value inside the interval', value: 50, lower: 1, upper: 100, expected: 50 },
    { name: 'a value below the lower bound', value: -5, lower: 1, upper: 100, expected: 1 },
    { name: 'a value above the upper bound', value: 150, lower: 1, upper: 100, expected: 100 },
    { name: 'a value equal to the lower bound', value: 1, lower: 1, upper: 100, expected: 1 },
    { name: 'a value equal to the upper bound', value: 100, lower: 1, upper: 100, expected: 100 },
    { name: 'decimal values', value: 5.99, lower: 1.99, upper: 70.99, expected: 5.99 },
    { name: 'an interval with equal bounds', value: 10, lower: 5, upper: 5, expected: 5 },
  ])('clamps $name', ({ value, lower, upper, expected }) => {
    expect(clampValue(value, lower, upper)).toBe(expected)
  })
})

describe('valueToPercent', () => {
  it.each([
    { name: 'the minimum', value: 1, min: 1, max: 100, expected: 0 },
    { name: 'the maximum', value: 100, min: 1, max: 100, expected: 100 },
    { name: 'the middle of the range', value: 50.5, min: 1, max: 100, expected: 50 },
    { name: 'a quarter of a range starting at zero', value: 50, min: 0, max: 200, expected: 25 },
    { name: 'a decimal range', value: 5.99, min: 1.99, max: 70.99, expected: (4 / 69) * 100 },
  ])('returns the percent for $name', ({ value, min, max, expected }) => {
    expect(valueToPercent(value, min, max)).toBeCloseTo(expected, 5)
  })

  it('returns 0 instead of NaN when min and max are equal', () => {
    expect(valueToPercent(5, 5, 5)).toBe(0)
  })
})

describe('percentToValue', () => {
  it.each([
    { name: '0 percent', percent: 0, min: 1, max: 100, expected: 1 },
    { name: '100 percent', percent: 100, min: 1, max: 100, expected: 100 },
    { name: 'the middle of the range', percent: 50, min: 1, max: 100, expected: 50.5 },
    { name: 'a range starting at zero', percent: 50, min: 0, max: 200, expected: 100 },
  ])('returns the value for $name', ({ percent, min, max, expected }) => {
    expect(percentToValue(percent, min, max)).toBe(expected)
  })

  it.each([
    { name: 'a result with many decimals', percent: 10, min: 1, max: 70.99, expected: 8 },
    { name: 'a long percent', percent: 12.3456, min: 0, max: 100, expected: 12.35 },
    { name: 'a repeating decimal', percent: 33.333, min: 0, max: 100, expected: 33.33 },
  ])('rounds to two decimals with $name', ({ percent, min, max, expected }) => {
    expect(percentToValue(percent, min, max)).toBe(expected)
  })

  it.each([
    { name: 'a negative percent', percent: -10, expected: 1 },
    { name: 'a percent above 100', percent: 150, expected: 100 },
  ])('never leaves the range with $name', ({ percent, expected }) => {
    expect(percentToValue(percent, 1, 100)).toBe(expected)
  })

  it('returns the minimum when min and max are equal', () => {
    expect(percentToValue(50, 5, 5)).toBe(5)
  })
})

describe('valueToPercent and percentToValue together', () => {
  it.each([
    { min: 1, max: 100, values: [1, 5.99, 10.99, 50.5, 70.99, 100] },
    { min: 1, max: 10000, values: [1, 5.99, 1234.56, 9999.99, 10000] },
    { min: 1.99, max: 70.99, values: [1.99, 5.99, 30.99, 70.99] },
  ])('round-trips values in the range $min to $max', ({ min, max, values }) => {
    for (const value of values) {
      const percent = valueToPercent(value, min, max)

      expect(percentToValue(percent, min, max)).toBe(value)
    }
  })
})