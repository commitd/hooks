import { renderHook } from '@testing-library/react-hooks'
import { useTimeout } from '.'

jest.useFakeTimers()

test('Should call handler once after the `delay`', () => {
  const handler = jest.fn()
  renderHook(() => useTimeout(handler, 1000))

  expect(handler).toHaveBeenCalledTimes(0)
  jest.advanceTimersByTime(5000)
  expect(handler).toHaveBeenCalledTimes(1)
})

test('Should pause timer when `delay` is `null`', () => {
  const handler = jest.fn()
  renderHook(() => useTimeout(handler, null))

  jest.advanceTimersByTime(5000)
  expect(handler).toHaveBeenCalledTimes(0)
})

test('Should change to new handler without resetting the timer', () => {
  const handler1 = jest.fn()
  const handler2 = jest.fn()

  const { rerender } = renderHook(({ handler }) => useTimeout(handler, 1000), {
    initialProps: { handler: handler1 },
  })

  jest.advanceTimersByTime(500)
  rerender({ handler: handler2 })

  jest.advanceTimersByTime(500)
  expect(handler1).toHaveBeenCalledTimes(0)
  expect(handler2).toHaveBeenCalledTimes(1)
})

test('Should not error if handler null', () => {
  renderHook(({ handler }) => useTimeout(handler, 1000), {
    initialProps: { handler: (null as unknown) as () => void },
  })

  jest.advanceTimersByTime(2000)
})

test('Should reset time if passed a new `delay`', () => {
  const handler = jest.fn()

  const { rerender } = renderHook(({ delay }) => useTimeout(handler, delay), {
    initialProps: { delay: 500 },
  })

  jest.advanceTimersByTime(1000)
  expect(handler).toHaveBeenCalledTimes(1)

  rerender({ delay: 1000 })
  jest.advanceTimersByTime(3000)
  expect(handler).toHaveBeenCalledTimes(2)
})
