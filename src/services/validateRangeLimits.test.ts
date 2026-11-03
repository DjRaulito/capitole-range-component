import { assertRangeLimits } from './validateRangeLimits'

describe('assertRangeLimits', () => {
  describe('valid data', () => {
    it.each([
      { name: 'a regular range', input: { min: 1, max: 100 } },
      { name: 'the smallest valid range', input: { min: 1, max: 2 } },
      { name: 'a range starting at zero', input: { min: 0, max: 100 } },
      { name: 'decimal limits', input: { min: 1.99, max: 70.99 } },
      { name: 'extra properties', input: { min: 1, max: 100, extra: true } },
    ])('accepts $name', ({ input }) => {
      expect(() => assertRangeLimits(input)).not.toThrow()
    })
  })

  describe('limits order', () => {
    it('min greater than the max', () => {
      expect(() => assertRangeLimits({ min: 100, max: 1 })).toThrow(
        'min must be lower than max',
      )
    })

    it('min equal to the max', () => {
      expect(() => assertRangeLimits({ min: 5, max: 5 })).toThrow(
        'min must be lower than max',
      )
    })
  })

  describe('invalid fields', () => {
    it.each([
      {
        name: 'a missing max',
        input: { min: 1 },
        error: 'max must be a finite number',
      },
      {
        name: 'a missing min',
        input: { max: 100 },
        error: 'min must be a finite number',
      },
      {
        name: 'a min as a string',
        input: { min: '1', max: 100 },
        error: 'min must be a finite number',
      },
      {
        name: 'a max as a string',
        input: { min: 1, max: '100' },
        error: 'max must be a finite number',
      },
      {
        name: 'a null max',
        input: { min: 1, max: null },
        error: 'max must be a finite number',
      },
      {
        name: 'a NaN min',
        input: { min: NaN, max: 100 },
        error: 'min must be a finite number',
      },
      {
        name: 'an Infinity max',
        input: { min: 1, max: Infinity },
        error: 'max must be a finite number',
      },
    ])('rejects $name', ({ input, error }) => {
      expect(() => assertRangeLimits(input)).toThrow(error)
    })

    it('rejects a negative min', () => {
      expect(() => assertRangeLimits({ min: -5, max: 100 })).toThrow(
        'min must not be negative',
      )
    })
  })

  describe('invalid input shape', () => {
    it.each([
      { name: 'null', input: null },
      { name: 'undefined', input: undefined },
      { name: 'a string', input: 'text' },
      { name: 'a number', input: 42 },
      { name: 'an array', input: [] },
    ])('rejects $name', ({ input }) => {
      expect(() => assertRangeLimits(input)).toThrow()
    })
  })
})
