import { renderHook, act } from '@testing-library/react-hooks'
import { useBoolean } from './useBoolean'

test('should start in given state', () => {
  const { result: first } = renderHook(() => useBoolean(false))
  const [falseValue] = first.current
  expect(falseValue).toBe(false)

  const { result: second } = renderHook(() => useBoolean(true))
  const [trueValue] = second.current
  expect(trueValue).toBe(true)
})

test('state should default to false', () => {
  const { result } = renderHook(() => useBoolean())
  expect(result.current[0]).toBe(false)
})

test('toggle should toggle', () => {
  const { result } = renderHook(() => useBoolean())

  act(() => {
    result.current[1].toggle()
  })

  expect(result.current[0]).toBe(true)

  act(() => {
    result.current[1].toggle()
  })

  expect(result.current[0]).toBe(false)
})

test('setTrue should set `true`', () => {
  const { result } = renderHook(() => useBoolean())

  act(() => {
    result.current[1].setTrue()
  })

  expect(result.current[0]).toBe(true)

  act(() => {
    result.current[1].setTrue()
  })

  expect(result.current[0]).toBe(true)
})

test('setFalse should set `setFalse`', () => {
  const { result } = renderHook(() => useBoolean())

  act(() => {
    result.current[1].setFalse()
  })

  expect(result.current[0]).toBe(false)

  act(() => {
    result.current[1].setFalse()
  })

  expect(result.current[0]).toBe(false)
})
