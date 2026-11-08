import { fireEvent, render, screen } from '@testing-library/react'

import Handle from './Handle'

const setPointerCapture = jest.fn()
const releasePointerCapture = jest.fn()

function renderHandle(percent = 25) {
  const onMove = jest.fn()

  render(
    <Handle
      percent={percent}
      label="Minimum price"
      valueNow={5.99}
      valueMin={1}
      valueMax={100}
      valueText="5.99€"
      onMove={onMove}
    />,
  )

  return { onMove, handle: screen.getByRole('slider') }
}

beforeEach(() => {
  setPointerCapture.mockClear()
  releasePointerCapture.mockClear()
  Element.prototype.setPointerCapture = setPointerCapture
  Element.prototype.releasePointerCapture = releasePointerCapture
})

describe('Handle', () => {
  it('shows a slider with the right name', () => {
    renderHandle()

    expect(
      screen.getByRole('slider', { name: 'Minimum price' }),
    ).toBeInTheDocument()
  })

  it('shows the value for screen readers', () => {
    const { handle } = renderHandle()

    expect(handle).toHaveAttribute('aria-valuenow', '5.99')
    expect(handle).toHaveAttribute('aria-valuemin', '1')
    expect(handle).toHaveAttribute('aria-valuemax', '100')
    expect(handle).toHaveAttribute('aria-valuetext', '5.99€')
  })

  it('can be focused with the keyboard', () => {
    const { handle } = renderHandle()

    handle.focus()

    expect(handle).toHaveFocus()
  })

  it('is placed at 25 percent', () => {
    const { handle } = renderHandle(25)

    expect(handle).toHaveStyle({ left: '25%' })
  })

  it('is placed at 100 percent', () => {
    const { handle } = renderHandle(100)

    expect(handle).toHaveStyle({ left: '100%' })
  })

  it('does not call onMove when it is only rendered', () => {
    const { onMove } = renderHandle()

    expect(onMove).not.toHaveBeenCalled()
  })

  it('captures the pointer when the drag starts', () => {
    const { handle } = renderHandle()

    fireEvent.pointerDown(handle)

    expect(setPointerCapture).toHaveBeenCalledTimes(1)
  })

  it('calls onMove with the mouse position while dragging', () => {
    const { handle, onMove } = renderHandle()

    fireEvent.pointerDown(handle)
    fireEvent.pointerMove(handle, { clientX: 120 })
    fireEvent.pointerMove(handle, { clientX: 150 })

    expect(onMove).toHaveBeenCalledTimes(2)
    expect(onMove).toHaveBeenNthCalledWith(1, 120)
    expect(onMove).toHaveBeenNthCalledWith(2, 150)
  })

  it('does not call onMove before the drag starts', () => {
    const { handle, onMove } = renderHandle()

    fireEvent.pointerMove(handle, { clientX: 120 })

    expect(onMove).not.toHaveBeenCalled()
  })

  it('stops calling onMove after the mouse is released', () => {
    const { handle, onMove } = renderHandle()

    fireEvent.pointerDown(handle)
    fireEvent.pointerUp(handle)
    fireEvent.pointerMove(handle, { clientX: 120 })

    expect(releasePointerCapture).toHaveBeenCalledTimes(1)
    expect(onMove).not.toHaveBeenCalled()
  })

  it('stops calling onMove when the drag is cancelled', () => {
    const { handle, onMove } = renderHandle()

    fireEvent.pointerDown(handle)
    fireEvent.pointerCancel(handle)
    fireEvent.pointerMove(handle, { clientX: 120 })

    expect(onMove).not.toHaveBeenCalled()
  })

  it('can be dragged again after a drag ends', () => {
    const { handle, onMove } = renderHandle()

    fireEvent.pointerDown(handle)
    fireEvent.pointerMove(handle, { clientX: 100 })
    fireEvent.pointerUp(handle)
    fireEvent.pointerDown(handle)
    fireEvent.pointerMove(handle, { clientX: 200 })

    expect(onMove).toHaveBeenCalledTimes(2)
    expect(onMove).toHaveBeenNthCalledWith(1, 100)
    expect(onMove).toHaveBeenNthCalledWith(2, 200)
  })
})