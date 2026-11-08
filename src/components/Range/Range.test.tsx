import { fireEvent, render, screen } from '@testing-library/react'

import Range from './Range'

const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

const setPointerCapture = jest.fn()
const releasePointerCapture = jest.fn()

beforeEach(() => {
  Element.prototype.setPointerCapture = setPointerCapture
  Element.prototype.releasePointerCapture = releasePointerCapture
})

function setTrackWidth() {
  const track = screen.getByTestId('range-track')

  jest.spyOn(track, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    right: 200,
    top: 0,
    bottom: 10,
    width: 200,
    height: 10,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })
}

function getHandles() {
  return {
    minHandle: screen.getByRole('slider', { name: 'Minimum price' }),
    maxHandle: screen.getByRole('slider', { name: 'Maximum price' }),
  }
}

function getInputs() {
  return {
    minInput: screen.getByRole('textbox', { name: 'Minimum price' }),
    maxInput: screen.getByRole('textbox', { name: 'Maximum price' }),
  }
}

function drag(handle: HTMLElement, clientX: number) {
  fireEvent.pointerDown(handle)
  fireEvent.pointerMove(handle, { clientX })
  fireEvent.pointerUp(handle)
}

function typeAndLeave(input: HTMLElement, text: string) {
  fireEvent.focus(input)
  fireEvent.change(input, { target: { value: text } })
  fireEvent.blur(input)
}

function valueOf(handle: HTMLElement) {
  return Number(handle.getAttribute('aria-valuenow'))
}

function renderNormalRange() {
  const onChange = jest.fn()

  render(<Range mode='normal' min={0} max={200} onChange={onChange} />)
  setTrackWidth()

  return { onChange, ...getHandles() }
}

function renderFixedRange() {
  render(<Range mode='fixed' values={fixedValues} />)
  setTrackWidth()

  return getHandles()
}

describe('Range in normal mode', () => {
  it('starts with the handles at the limits', () => {
    const { minHandle, maxHandle } = renderNormalRange()

    expect(valueOf(minHandle)).toBe(0)
    expect(valueOf(maxHandle)).toBe(200)
  })

  it('shows an input for each price', () => {
    renderNormalRange()
    const { minInput, maxInput } = getInputs()

    expect(minInput).toHaveValue('0')
    expect(maxInput).toHaveValue('200')
  })

  describe('when a handle is dragged', () => {
    it('moves the minimum handle to the mouse position', () => {
      const { minHandle } = renderNormalRange()

      drag(minHandle, 50)

      expect(valueOf(minHandle)).toBe(50)
      expect(getInputs().minInput).toHaveValue('50')
    })

    it('moves the maximum handle to the mouse position', () => {
      const { maxHandle } = renderNormalRange()

      drag(maxHandle, 150)

      expect(valueOf(maxHandle)).toBe(150)
      expect(getInputs().maxInput).toHaveValue('150')
    })

    it('does not let the minimum handle go below the limit', () => {
      const { minHandle } = renderNormalRange()

      drag(minHandle, -50)

      expect(valueOf(minHandle)).toBe(0)
    })

    it('does not let the maximum handle go above the limit', () => {
      const { maxHandle } = renderNormalRange()

      drag(maxHandle, 500)

      expect(valueOf(maxHandle)).toBe(200)
    })

    it('does not let the minimum handle reach the maximum handle', () => {
      const { minHandle, maxHandle } = renderNormalRange()

      drag(minHandle, 500)

      expect(valueOf(minHandle)).toBeLessThan(valueOf(maxHandle))
    })

    it('does not let the maximum handle reach the minimum handle', () => {
      const { minHandle, maxHandle } = renderNormalRange()

      drag(maxHandle, -50)

      expect(valueOf(maxHandle)).toBeGreaterThan(valueOf(minHandle))
    })

    it('calls onChange with both values', () => {
      const { minHandle, onChange } = renderNormalRange()

      drag(minHandle, 50)

      expect(onChange).toHaveBeenLastCalledWith({ min: 50, max: 200 })
    })
  })

  describe('when a price is typed', () => {
    it('moves the minimum handle to the typed price', () => {
      const { minHandle } = renderNormalRange()

      typeAndLeave(getInputs().minInput, '50')

      expect(valueOf(minHandle)).toBe(50)
    })

    it('moves the maximum handle to the typed price', () => {
      const { maxHandle } = renderNormalRange()

      typeAndLeave(getInputs().maxInput, '150')

      expect(valueOf(maxHandle)).toBe(150)
    })

    it('does not let the minimum price reach the maximum price', () => {
      const { minHandle, maxHandle } = renderNormalRange()

      typeAndLeave(getInputs().minInput, '300')

      expect(valueOf(minHandle)).toBeLessThan(valueOf(maxHandle))
      expect(getInputs().minInput).not.toHaveValue('300')
    })
  })
})

describe('Range in fixed mode', () => {
  // With 6 values on a 200px track, the values are 40px apart:
  // 0px, 40px, 80px, 120px, 160px and 200px.
  it('starts with the handles at the first and the last value', () => {
    const { minHandle, maxHandle } = renderFixedRange()

    expect(valueOf(minHandle)).toBe(1.99)
    expect(valueOf(maxHandle)).toBe(70.99)
  })

  it('shows the prices as text and not as inputs', () => {
    renderFixedRange()

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('1.99')).toBeInTheDocument()
    expect(screen.getByText('70.99')).toBeInTheDocument()
  })

  it('moves the minimum handle to the closest value', () => {
    const { minHandle } = renderFixedRange()

    drag(minHandle, 85)

    expect(valueOf(minHandle)).toBe(10.99)
    expect(screen.getByText('10.99')).toBeInTheDocument()
  })

  it('moves the maximum handle to the closest value', () => {
    const { maxHandle } = renderFixedRange()

    drag(maxHandle, 110)

    expect(valueOf(maxHandle)).toBe(30.99)
  })

  it('stops the minimum handle one value before the maximum handle', () => {
    const { minHandle } = renderFixedRange()

    drag(minHandle, 500)

    expect(valueOf(minHandle)).toBe(50.99)
  })

  it('stops the maximum handle one value after the minimum handle', () => {
    const { maxHandle } = renderFixedRange()

    drag(maxHandle, -50)

    expect(valueOf(maxHandle)).toBe(5.99)
  })
})
