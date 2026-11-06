import { formatPrice, parsePrice, roundToCents } from './price'

describe('roundToCents', () => {
  it.each([
    { name: 'an integer', input: 5, expected: 5 },
    { name: 'a value with two decimals', input: 70.99, expected: 70.99 },
    { name: 'a value with one decimal', input: 5.5, expected: 5.5 },
    { name: 'three decimals rounding down', input: 5.994, expected: 5.99 },
    { name: 'three decimals rounding up', input: 5.996, expected: 6 },
    { name: 'a long decimal', input: 12.3456, expected: 12.35 },
    { name: 'zero', input: 0, expected: 0 },
  ])('rounds $name', ({ input, expected }) => {
    expect(roundToCents(input)).toBe(expected)
  })
})

describe('formatPrice', () => {
  it.each([
    { name: 'an integer', input: 1, expected: '1€' },
    { name: 'a large integer', input: 10000, expected: '10000€' },
    { name: 'two decimals', input: 5.99, expected: '5.99€' },
    { name: 'the highest fixed value', input: 70.99, expected: '70.99€' },
    { name: 'one decimal without trailing zeros', input: 5.5, expected: '5.5€' },
    { name: 'zero', input: 0, expected: '0€' },
  ])('formats $name', ({ input, expected }) => {
    expect(formatPrice(input)).toBe(expected)
  })

  it.each([
    { name: 'three decimals rounding down', input: 5.994, expected: '5.99€' },
    { name: 'three decimals rounding up', input: 5.999, expected: '6€' },
  ])('rounds before formatting $name', ({ input, expected }) => {
    expect(formatPrice(input)).toBe(expected)
  })
})

describe('parsePrice', () => {
  describe('valid text', () => {
    it.each([
      { name: 'a dot decimal', input: '5.99', expected: 5.99 },
      { name: 'a comma decimal', input: '5,99', expected: 5.99 },
      { name: 'an integer', input: '100', expected: 100 },
      { name: 'zero', input: '0', expected: 0 },
      { name: 'surrounding spaces', input: '  5,99  ', expected: 5.99 },
      { name: 'a trailing euro sign', input: '5.99€', expected: 5.99 },
      { name: 'a euro sign after a space', input: '5,99 €', expected: 5.99 },
      { name: 'more than two decimals (it does not round)', input: '5.999', expected: 5.999 },
    ])('parses $name', ({ input, expected }) => {
      expect(parsePrice(input)).toBe(expected)
    })
  })

  describe('invalid text', () => {
    it.each([
      { name: 'an empty string', input: '' },
      { name: 'only spaces', input: '   ' },
      { name: 'letters', input: 'abc' },
      { name: 'numbers followed by letters', input: '12abc' },
      { name: 'two dots', input: '5.9.9' },
      { name: 'two commas', input: '5,9,9' },
      { name: 'only a euro sign', input: '€' },
      { name: 'Infinity', input: 'Infinity' },
      { name: 'NaN', input: 'NaN' },
    ])('returns null for $name', ({ input }) => {
      expect(parsePrice(input)).toBeNull()
    })
  })
})