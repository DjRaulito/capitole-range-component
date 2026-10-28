import '@testing-library/jest-dom'

if (typeof window.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {}
  Object.defineProperty(window, 'PointerEvent', {
    value: PointerEventPolyfill,
    writable: true,
  })
}

Element.prototype.setPointerCapture = jest.fn()
Element.prototype.releasePointerCapture = jest.fn()