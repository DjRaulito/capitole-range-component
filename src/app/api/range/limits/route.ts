import { RangeLimits } from '@/types/range'

export async function GET() {
  const body: RangeLimits = { min: 1, max: 100 }
  return Response.json(body)
}
