import { act, renderHook } from '@testing-library/react-hooks'
import { useDebounce } from '.'

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  act(() => {
    jest.runOnlyPendingTimers()
  })
  jest.useRealTimers()
})

test('Should set value to the initial immediately`', () => {
  const { result } = renderHook(({ value }) => useDebounce(value, 1000), {
    initialProps: { value: 'default' },
  })
  expect(result.current[0]).toEqual('default')
})

test('Should set value to the updated only after the `delay`', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 1000),
    {
      initialProps: { value: 'default' },
    }
  )

  rerender({ value: 'test' })
  expect(result.current[0]).toEqual('default')
  act(() => {
    jest.advanceTimersByTime(500)
  })
  expect(result.current[0]).toEqual('default')
  act(() => {
    jest.advanceTimersByTime(500)
  })
  expect(result.current[0]).toEqual('test')
})

test('Should only set value to the updated only after the full `delay` with no edits', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 1000),
    {
      initialProps: { value: 'default' },
    }
  )

  rerender({ value: 't' })
  act(() => {
    jest.advanceTimersByTime(900)
  })
  expect(result.current[0]).toEqual('default')

  rerender({ value: 'te' })
  act(() => {
    jest.advanceTimersByTime(900)
  })
  expect(result.current[0]).toEqual('default')

  rerender({ value: 'tes' })
  act(() => {
    jest.advanceTimersByTime(900)
  })
  expect(result.current[0]).toEqual('default')
  rerender({ value: 'test' })
  act(() => {
    jest.advanceTimersByTime(900)
  })
  expect(result.current[0]).toEqual('default')

  act(() => {
    jest.advanceTimersByTime(500)
  })
  expect(result.current[0]).toEqual('test')
})

test('Should set instantly if `delay` null', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, null),
    {
      initialProps: { value: 'default' },
    }
  )

  rerender({ value: 'test' })
  expect(result.current[0]).toEqual('test')
})

test('Should be able to force the value using the flush function', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 1000),
    {
      initialProps: { value: 'default' },
    }
  )

  rerender({ value: 'test' })
  act(() => {
    jest.advanceTimersByTime(500)
  })
  expect(result.current[0]).toEqual('default')
  act(() => {
    result.current[1]()
  })
  expect(result.current[0]).toEqual('test')
})
