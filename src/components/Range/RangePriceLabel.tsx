'use client'

import { parsePrice, roundToCents } from '@/lib/range/price'
import { useState } from 'react'

export default function RangePriceLabel({
  value,
  label,
  editable,
  onChange,
}: {
  value: number
  label: string
  editable: boolean
  onChange?: (value: number) => void
}) {
  const [inputValue, setInputValue] = useState<string | null>(null)

  return (
    <>
      {editable ? (
        <input
          type='text'
          inputMode='decimal'
          aria-label={label}
          value={inputValue ?? String(roundToCents(value))}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={() => {
            const parsedValue = parsePrice(inputValue ?? '')
            if (parsedValue !== null) {
              onChange?.(roundToCents(parsedValue))
            }
            setInputValue(null)
          }}
        />
      ) : (
        <span>{roundToCents(value)}</span>
      )}
      <span>€</span>
    </>
  )
}
