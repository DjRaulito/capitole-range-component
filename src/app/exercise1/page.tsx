export const dynamic = 'force-dynamic'
export default async function Exercise1() {

  const response = await fetch('http://localhost:8080/api/range/limits')
  const data = await response.json()

  return <div>{data.min} - {data.max}</div>
}
