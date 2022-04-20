import { act, renderHook } from '@testing-library/react-hooks'
import { useModal } from './useModal'

test('should start in given state', () => {
  const { result: first } = renderHook(() => useModal(false))
  const [falseValue] = first.current
  expect(falseValue).toBe(false)

  const { result: second } = renderHook(() => useModal(true))
  const [trueValue] = second.current
  expect(trueValue).toBe(true)
})

test('state should default to false', () => {
  const { result } = renderHook(() => useModal())
  expect(result.current[0]).toBe(false)
})

test('show should set visible `true`', () => {
  const { result } = renderHook(() => useModal())

  act(() => {
    result.current[1]()
  })

  expect(result.current[0]).toBe(true)

  act(() => {
    result.current[1]()
  })

  expect(result.current[0]).toBe(true)
})

test('hide should set visible `false`', () => {
  const { result } = renderHook(() => useModal())

  act(() => {
    result.current[2]()
  })

  expect(result.current[0]).toBe(false)

  act(() => {
    result.current[2]()
  })

  expect(result.current[0]).toBe(false)
})
