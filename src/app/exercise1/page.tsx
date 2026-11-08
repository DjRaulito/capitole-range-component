import Range from '@/components/Range/Range'
import { getRangeLimits } from '@/services/rangeServices'

export const dynamic = 'force-dynamic'
export default async function Exercise1() {
  const data = await getRangeLimits()

  return (
    <Range mode='normal' min={data.min} max={data.max} />
  )
}
