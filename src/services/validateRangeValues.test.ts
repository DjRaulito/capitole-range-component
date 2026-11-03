import { assertRangeValues } from './validateRangeValues'

describe('assertRangeValues', () => {
  describe('valid data', () => {
    it.each([
      {
        name: 'the values from the example',
        input: { rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] },
      },
      { name: 'the smallest valid list', input: { rangeValues: [1.99, 5.99] } },
      { name: 'a list starting at zero', input: { rangeValues: [0, 5.99] } },
      {
        name: 'extra properties',
        input: { rangeValues: [1.99, 5.99], extra: true },
      },
    ])('accepts $name', ({ input }) => {
      expect(() => assertRangeValues(input)).not.toThrow()
    })
  })

  describe('rangeValues is not an array', () => {
    it.each([
      { name: 'a missing key', input: {} },
      { name: 'a string', input: { rangeValues: 'text' } },
      { name: 'null', input: { rangeValues: null } },
      { name: 'an object', input: { rangeValues: {} } },
    ])('rejects $name', ({ input }) => {
      expect(() => assertRangeValues(input)).toThrow(
        'rangeValues must be an array',
      )
    })
  })

  describe('not enough values', () => {
    it.each([
      { name: 'an empty list', input: { rangeValues: [] } },
      { name: 'a single value', input: { rangeValues: [5.99] } },
    ])('rejects $name', ({ input }) => {
      expect(() => assertRangeValues(input)).toThrow('at least two values')
    })
  })

  describe('invalid values', () => {
    it.each([
      {
        name: 'a string element',
        input: { rangeValues: [1.99, '5.99', 10.99] },
      },
      { name: 'a NaN element', input: { rangeValues: [1.99, NaN, 10.99] } },
      { name: 'an Infinity element', input: { rangeValues: [1.99, Infinity] } },
      { name: 'a null element', input: { rangeValues: [1.99, null, 10.99] } },
    ])('rejects $name', ({ input }) => {
      expect(() => assertRangeValues(input)).toThrow('finite numbers')
    })
    it('rejects a negative value', () => {
      expect(() => assertRangeValues({ rangeValues: [-1.99, 5.99] })).toThrow(
        'rangeValues must not be negative',
      )
    })
  })

  describe('order and duplicates', () => {
    it.each([
      { name: 'an unsorted list', input: { rangeValues: [10.99, 1.99, 5.99] } },
      {
        name: 'a descending list',
        input: { rangeValues: [70.99, 50.99, 10.99] },
      },
      {
        name: 'duplicates at the start',
        input: { rangeValues: [1.99, 1.99, 5.99] },
      },
      {
        name: 'duplicates at the end',
        input: { rangeValues: [1.99, 5.99, 5.99] },
      },
    ])('rejects $name', ({ input }) => {
      expect(() => assertRangeValues(input)).toThrow('strictly ascending')
    })
    it('does not modify the input while validating it', () => {
      const input = { rangeValues: [10.99, 1.99, 5.99] }
      expect(() => assertRangeValues(input)).toThrow()
      expect(input.rangeValues).toEqual([10.99, 1.99, 5.99])
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
      expect(() => assertRangeValues(input)).toThrow()
    })
  })
})
