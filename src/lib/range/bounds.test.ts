import { clampHandleValue } from './bounds'

describe('clampHandleValue', () => {
  const limits = { min: 1, max: 100 }
  const selected = { min: 20, max: 80 }
  const minGap = 5

  describe('min handle', () => {
    it.each([
      { name: 'a value below the current max', value: 10, expected: 10 },
      { name: 'the current position', value: 20, expected: 20 },
      { name: 'a value exactly one gap below the max', value: 75, expected: 75 },
      { name: 'a value inside the gap', value: 78, expected: 75 },
      { name: 'a value equal to the max', value: 80, expected: 75 },
      { name: 'a value past the max', value: 95, expected: 75 },
      { name: 'a value below the lower limit', value: -3, expected: 1 },
      { name: 'a value equal to the lower limit', value: 1, expected: 1 },
    ])('handles $name', ({ value, expected }) => {
      expect(clampHandleValue('min', value, selected, limits, minGap)).toBe(expected)
    })
  })

  describe('max handle', () => {
    it.each([
      { name: 'a value above the current min', value: 90, expected: 90 },
      { name: 'the current position', value: 80, expected: 80 },
      { name: 'a value exactly one gap above the min', value: 25, expected: 25 },
      { name: 'a value inside the gap', value: 22, expected: 25 },
      { name: 'a value equal to the min', value: 20, expected: 25 },
      { name: 'a value past the min', value: 5, expected: 25 },
      { name: 'a value above the upper limit', value: 150, expected: 100 },
      { name: 'a value equal to the upper limit', value: 100, expected: 100 },
    ])('handles $name', ({ value, expected }) => {
      expect(clampHandleValue('max', value, selected, limits, minGap)).toBe(expected)
    })
  })

  describe('decimal values', () => {
    const decimalLimits = { min: 1.99, max: 70.99 }
    const decimalSelected = { min: 5.99, max: 50.99 }

    it('keeps the min handle one gap below the max', () => {
      const result = clampHandleValue('min', 60, decimalSelected, decimalLimits, 0.5)

      expect(result).toBeCloseTo(50.49, 2)
    })

    it('keeps the max handle one gap above the min', () => {
      const result = clampHandleValue('max', 1, decimalSelected, decimalLimits, 0.5)

      expect(result).toBeCloseTo(6.49, 2)
    })
  })

  describe('limits always win', () => {
    it('keeps the min handle at its lower limit when the gap does not fit', () => {
      const tight = { min: 1, max: 3 }

      expect(clampHandleValue('min', 2, tight, limits, 5)).toBe(1)
    })

    it('keeps the max handle at its upper limit when the gap does not fit', () => {
      const tight = { min: 98, max: 100 }

      expect(clampHandleValue('max', 99, tight, limits, 5)).toBe(100)
    })
  })

  it('does not modify its inputs', () => {
    const frozenSelected = Object.freeze({ min: 20, max: 80 })
    const frozenLimits = Object.freeze({ min: 1, max: 100 })

    expect(() =>
      clampHandleValue('min', 78, frozenSelected, frozenLimits, 5),
    ).not.toThrow()
    expect(frozenSelected).toEqual({ min: 20, max: 80 })
  })
})