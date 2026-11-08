import Range from '@/components/Range/Range'
import { getRangeValues } from '@/services/rangeServices'

export const dynamic = 'force-dynamic'
export default async function Exercise2() {
  const data = await getRangeValues()
  return <Range mode='fixed' values={data.rangeValues} />
}
