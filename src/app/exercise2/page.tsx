import { getRangeValues } from '@/services/rangeServices'

export const dynamic = 'force-dynamic'
export default async function Exercise2() {
  const data = await getRangeValues()
  return (
    <div>
      {data.rangeValues.map((value, index) => (
        <span key={index}>
          {value}
          {index < data.rangeValues.length - 1 && ' - '}
        </span>
      ))}
    </div>
  )
}
