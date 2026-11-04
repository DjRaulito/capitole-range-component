import { fireEvent, render, screen } from '@testing-library/react'
import ErrorPage from './error'

describe('ErrorPage', () => {
  const technicalError = new Error('Could not load range limits. Status: 500')
  let consoleErrorSpy: jest.SpyInstance

  const renderPage = (retry = jest.fn()) => {
    render(<ErrorPage error={technicalError} retry={retry} />)
    return { retry }
  }

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows a generic message to the user', () => {
    renderPage()

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('We couldn’t load the data')).toBeInTheDocument()
  })

  it('does not expose the technical error message', () => {
    renderPage()

    expect(screen.queryByText('status: 500')).not.toBeInTheDocument()
    expect(
      screen.queryByText('could not load range limits'),
    ).not.toBeInTheDocument()
  })

  it('logs the original error', () => {
    renderPage()

    expect(consoleErrorSpy).toHaveBeenCalledWith(technicalError)
  })

  it('renders a button to try again', () => {
    renderPage()

    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument()
  })

  it('does not retry until the user clicks the button', () => {
    const { retry } = renderPage()

    expect(retry).not.toHaveBeenCalled()
  })

  it('calls retry when the button is clicked', () => {
    const { retry } = renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
