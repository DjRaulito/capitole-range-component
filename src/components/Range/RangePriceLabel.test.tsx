import { fireEvent, render, screen } from '@testing-library/react'

import RangePriceLabel from './RangePriceLabel'

function renderEditableLabel(value = 5.99) {
  const onChange = jest.fn()

  render(
    <RangePriceLabel
      label='Minimum price'
      value={value}
      editable
      onChange={onChange}
    />,
  )

  return {
    onChange,
    input: screen.getByRole('textbox', { name: 'Minimum price' }),
  }
}

function typeAndOnBlur(input: HTMLElement, text: string) {
  fireEvent.focus(input)
  fireEvent.change(input, { target: { value: text } })
  fireEvent.blur(input)
}

describe('RangePriceLabel', () => {
  describe('when it can be edited', () => {
    it('shows the value in an input', () => {
      const { input } = renderEditableLabel(5.99)

      expect(input).toHaveValue('5.99')
    })

    it('shows whole numbers without decimals', () => {
      const { input } = renderEditableLabel(100)

      expect(input).toHaveValue('100')
    })

    it('shows a euro sign next to the input', () => {
      renderEditableLabel()

      expect(screen.getByText('€')).toBeInTheDocument()
    })

    it('does not call onChange while the user is typing', () => {
      const { input, onChange } = renderEditableLabel()

      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '20' } })

      expect(onChange).not.toHaveBeenCalled()
    })

    it('calls onChange with the new value when the input loses focus', () => {
      const { input, onChange } = renderEditableLabel()

      typeAndOnBlur(input, '20')

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(20)
    })

    it('accepts a comma as the decimal separator', () => {
      const { input, onChange } = renderEditableLabel()

      typeAndOnBlur(input, '7,5')

      expect(onChange).toHaveBeenCalledWith(7.5)
    })

    it('rounds the new value to two decimals', () => {
      const { input, onChange } = renderEditableLabel()

      typeAndOnBlur(input, '12.3456')

      expect(onChange).toHaveBeenCalledWith(12.35)
    })

    it('ignores an empty text', () => {
      const { input, onChange } = renderEditableLabel()

      typeAndOnBlur(input, '')

      expect(onChange).not.toHaveBeenCalled()
      expect(input).toHaveValue('5.99')
    })

    it('ignores a text that is not a number', () => {
      const { input, onChange } = renderEditableLabel()

      typeAndOnBlur(input, 'abc')

      expect(onChange).not.toHaveBeenCalled()
      expect(input).toHaveValue('5.99')
    })

    it('shows the value it received after the input loses focus', () => {
      const { input } = renderEditableLabel()

      typeAndOnBlur(input, '20')

      expect(input).toHaveValue('5.99')
    })

    it('shows the new value when the value prop changes', () => {
      const { rerender } = render(
        <RangePriceLabel
          label='Minimum price'
          value={5.99}
          editable
          onChange={jest.fn()}
        />,
      )

      rerender(
        <RangePriceLabel
          label='Minimum price'
          value={20}
          editable
          onChange={jest.fn()}
        />,
      )

      expect(screen.getByRole('textbox')).toHaveValue('20')
    })
  })

  describe('when it is read only', () => {
    it('shows the price as text', () => {
      render(
        <RangePriceLabel label='Minimum price' value={5.99} editable={false} />,
      )

      expect(screen.getByText('5.99')).toBeInTheDocument()
      expect(screen.getByText('€')).toBeInTheDocument()
    })

    it('does not show an input', () => {
      render(
        <RangePriceLabel label='Minimum price' value={5.99} editable={false} />,
      )

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })
})
