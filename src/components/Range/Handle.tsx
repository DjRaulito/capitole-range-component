'use client'

import { useRef } from 'react'
import styles from './Handle.module.css'

export default function Handle({
  percent,
  label,
  valueNow,
  valueMin,
  valueMax,
  valueText,
  onMove,
}: {
  percent: number
  label: string
  valueNow: number
  valueMin: number
  valueMax: number
  valueText: string
  onMove: (clientX: number) => void
}) {
  const isDragging = useRef(false)
  return (
    <div
      tabIndex={0}
      className={styles.handle}
      role='slider'
      aria-label={label}
      aria-valuenow={valueNow}
      aria-valuemin={valueMin}
      aria-valuemax={valueMax}
      aria-valuetext={valueText}
      style={{ left: `${percent}%` }}
      onPointerMove={(event) =>
        isDragging.current ? onMove(event.clientX) : null
      }
      onPointerDown={(event) => {
        isDragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerUp={(event) => {
        isDragging.current = false
        event.currentTarget.releasePointerCapture(event.pointerId)
      }}
      onPointerCancel={(event) => {
        isDragging.current = false
        event.currentTarget.releasePointerCapture(event.pointerId)
      }}
    />
  )
}
