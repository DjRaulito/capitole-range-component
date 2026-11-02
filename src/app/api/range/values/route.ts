import { RangeValues } from '@/types/range'

export async function GET() {
  const body: RangeValues = {
    rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
  }
  return Response.json(body)
}
