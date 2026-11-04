'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  retry,
}: {
  error: Error
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <p>Something went wrong</p>
      <p>We couldn’t load the data</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
