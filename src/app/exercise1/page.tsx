import { getRangeLimits } from "@/services/rangeServices"

export const dynamic = 'force-dynamic'
export default async function Exercise1() {

  const data = await getRangeLimits()

  return <div>{data.min} - {data.max}</div>
}
