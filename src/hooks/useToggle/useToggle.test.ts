import { renderHook, act } from '@testing-library/react-hooks'
import { useToggle } from './useToggle'

test('should start in given state', () => {
  const { result: first } = renderHook(() => useToggle(false))
  const [falseValue] = first.current
  expect(falseValue).toBe(false)

  const { result: second } = renderHook(() => useToggle(true))
  const [trueValue] = second.current
  expect(trueValue).toBe(true)
})

test('toggle should default to false', () => {
  const { result } = renderHook(() => useToggle())
  expect(result.current[0]).toBe(false)
})

test('toggle should toggle', () => {
  const { result } = renderHook(() => useToggle())

  act(() => {
    result.current[1]()
  })

  expect(result.current[0]).toBe(true)

  act(() => {
    result.current[1]()
  })

  expect(result.current[0]).toBe(false)
})

test('can still force value', () => {
  const { result } = renderHook(() => useToggle(false))
  expect(result.current[0]).toBe(false)

  act(() => {
    result.current[2](true)
  })

  expect(result.current[0]).toBe(true)
})
