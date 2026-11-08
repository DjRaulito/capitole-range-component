'use client'

import { useRef, useState } from 'react'
import {
  indexToPercent,
  percentToIndex,
  percentToValue,
  valueToPercent,
} from '@/lib/range/math'
import { formatPrice, roundToCents } from '@/lib/range/price'
import Handle from './Handle'
import RangePriceLabel from './RangePriceLabel'
import styles from './Range.module.css'
import { clampHandleValue } from '@/lib/range/bounds'

type RangeSelectionValues = {
  min: number
  max: number
}

type RangeCommonProps = {
  onChange?: (rangeValues: RangeSelectionValues) => void
}

type RangeNormalProps = RangeCommonProps & {
  mode: 'normal'
  min: number
  max: number
}

type RangeFixedProps = RangeCommonProps & {
  mode: 'fixed'
  values: number[]
}

type RangeProps = RangeNormalProps | RangeFixedProps

const GAP_PERCENT = 5
const MINIMUM_LABEL = 'Minimum price'
const MAXIMUM_LABEL = 'Maximum price'

export default function Range(props: RangeProps) {
  const isEditable = props.mode === 'normal'
  const limits: RangeSelectionValues =
    props.mode === 'normal'
      ? { min: props.min, max: props.max }
      : { min: props.values[0], max: props.values[props.values.length - 1] }

  const [selectedRange, setSelectedRange] =
    useState<RangeSelectionValues>(limits)

  const rangeRef = useRef<HTMLDivElement>(null)

  function updateHandle(handle: 'min' | 'max', value: number) {
    let newValue: number

    if (props.mode === 'fixed') {
      const values = props.values
      const indexes = {
        min: values.indexOf(selectedRange.min),
        max: values.indexOf(selectedRange.max),
      }
      const newIndex = clampHandleValue(
        handle,
        values.indexOf(value),
        indexes,
        { min: 0, max: values.length - 1 },
        1,
      )
      newValue = values[newIndex]
    } else {
      const minGap = ((limits.max - limits.min) * GAP_PERCENT) / 100
      newValue = roundToCents(
        clampHandleValue(handle, value, selectedRange, limits, minGap),
      )
    }
    const next = { ...selectedRange, [handle]: newValue }

    setSelectedRange(next)
    props.onChange?.(next)
  }

  function moveHandle(handle: 'min' | 'max', clientX: number) {
    const track = rangeRef.current?.getBoundingClientRect()
    if (!track) return
    const percent = valueToPercent(clientX - track.left, 0, track.width)
    const value =
      props.mode === 'fixed'
        ? props.values[percentToIndex(percent, props.values.length)]
        : percentToValue(percent, limits.min, limits.max)
    updateHandle(handle, value)
  }

  function toPercent(value: number) {
    if (!isEditable) {
      return indexToPercent(props.values.indexOf(value), props.values.length)
    }
    return valueToPercent(value, limits.min, limits.max)
  }

  return (
    <div className={styles.rangeContainer}>
      <RangePriceLabel
        value={selectedRange.min}
        editable={isEditable}
        label={MINIMUM_LABEL}
        onChange={(value) => updateHandle('min', value)}
      />
      <div ref={rangeRef} data-testid='range-track' className={styles.track}>
        <Handle
          percent={toPercent(selectedRange.min)}
          label={MINIMUM_LABEL}
          valueNow={selectedRange.min}
          valueMin={limits.min}
          valueMax={limits.max}
          valueText={formatPrice(selectedRange.min)}
          onMove={(clientX) => {
            moveHandle('min', clientX)
          }}
        />
        <Handle
          percent={toPercent(selectedRange.max)}
          label={MAXIMUM_LABEL}
          valueNow={selectedRange.max}
          valueMin={limits.min}
          valueMax={limits.max}
          valueText={formatPrice(selectedRange.max)}
          onMove={(clientX) => {
            moveHandle('max', clientX)
          }}
        />
      </div>
      <RangePriceLabel
        value={selectedRange.max}
        label={MAXIMUM_LABEL}
        editable={isEditable}
        onChange={(value) => updateHandle('max', value)}
      />
    </div>
  )
}
