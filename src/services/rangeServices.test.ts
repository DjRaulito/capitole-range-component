import { getRangeLimits, getRangeValues } from './rangeServices'
const fetchMock = jest.fn()
const originalFetch = global.fetch
const originalBaseUrl = process.env.API_BASE_URL

const jsonResponse = (
  body: unknown,
  { ok = true, status = 200 }: { ok?: boolean; status?: number } = {},
) => ({ ok, status, json: async () => body })

const services = [
  {
    name: 'getRangeLimits',
    call: getRangeLimits,
    path: '/api/range/limits',
    loadError: 'Could not load range limits',
    valid: { min: 1, max: 100 },
    invalid: { min: 100, max: 1 },
    validationError: 'min must be lower than max',
  },
  {
    name: 'getRangeValues',
    call: getRangeValues,
    path: '/api/range/values',
    loadError: 'Could not load range values',
    valid: { rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] },
    invalid: { rangeValues: [] },
    validationError: 'rangeValues must contain at least two values',
  },
]

beforeEach(() => {
  fetchMock.mockReset()
  global.fetch = fetchMock
  delete process.env.API_BASE_URL
})

afterEach(() => {
  if (originalBaseUrl === undefined) {
    delete process.env.API_BASE_URL
  } else {
    process.env.API_BASE_URL = originalBaseUrl
  }
})

afterAll(() => {
  global.fetch = originalFetch
})

describe.each(services)(
  '$name',
  ({ call, path, loadError, valid, invalid, validationError }) => {
    describe('successful responses', () => {
      it('returns the data when the response is valid', async () => {
        fetchMock.mockResolvedValue(jsonResponse(valid))
        await expect(call()).resolves.toEqual(valid)
        expect(fetchMock).toHaveBeenCalledTimes(1)
      })
      it('rejects valid HTTP responses that contain invalid data', async () => {
        fetchMock.mockResolvedValue(jsonResponse(invalid))
        await expect(call()).rejects.toThrow(validationError)
      })
      it('rejects when the body is not valid JSON', async () => {
        fetchMock.mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => {
            throw new Error('Invalid JSON')
          },
        })
        await expect(call()).rejects.toThrow('Invalid JSON')
      })
    })

    describe('failed responses', () => {
      it.each([404, 500])(
        'includes the status %i in the error',
        async (status) => {
          fetchMock.mockResolvedValue(jsonResponse(null, { ok: false, status }))
          await expect(call()).rejects.toThrow(
            `${loadError}. Status: ${status}`,
          )
        },
      )
      it('does not try to validate the body of a failed response', async () => {
        fetchMock.mockResolvedValue(
          jsonResponse(valid, { ok: false, status: 500 }),
        )
        await expect(call()).rejects.toThrow(loadError)
      })
      it('propagates network errors', async () => {
        fetchMock.mockRejectedValue(new Error('Network down'))
        await expect(call()).rejects.toThrow('Network down')
      })
    })

    describe('base URL', () => {
      const requestedUrl = () => fetchMock.mock.calls[0][0]
      beforeEach(() => {
        fetchMock.mockResolvedValue(jsonResponse(valid))
      })
      it('uses localhost:8080 when API_BASE_URL is not defined', async () => {
        await call()
        expect(requestedUrl()).toBe(`http://localhost:8080${path}`)
      })
      it('uses localhost:8080 when API_BASE_URL is blank', async () => {
        process.env.API_BASE_URL = '   '
        await call()
        expect(requestedUrl()).toBe(`http://localhost:8080${path}`)
      })
      it('uses API_BASE_URL when it is defined', async () => {
        process.env.API_BASE_URL = 'https://api.example.com'
        await call()
        expect(requestedUrl()).toBe(`https://api.example.com${path}`)
      })
      it('removes trailing slashes from API_BASE_URL', async () => {
        process.env.API_BASE_URL = 'https://api.example.com//'
        await call()
        expect(requestedUrl()).toBe(`https://api.example.com${path}`)
      })
    })
  },
)
