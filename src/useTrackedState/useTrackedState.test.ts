import { act, renderHook } from '@testing-library/react-hooks'
import { useTrackedState } from '.'

interface TestData {
  test: string
}

const initialState = { test: 'first' }
const newState = { test: 'second' }

test('Should start undefined if no initial value given', () => {
  const { result } = renderHook(() => useTrackedState<string>())
  const [value, setValue, { undo, redo, canUndo, canRedo }] = result.current
  expect(value).toBeUndefined()
  expect(typeof setValue).toBe('function')
  expect(typeof undo).toBe('function')
  expect(typeof redo).toBe('function')
  expect(canUndo).toEqual(false)
  expect(canRedo).toEqual(false)
})

test('Should start with given initial state', () => {
  const { result } = renderHook(() => useTrackedState(initialState))
  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual(initialState)
  expect(canUndo).toEqual(false)
  expect(canRedo).toEqual(false)
})

test('Should start with given initial state from function call', () => {
  const { result } = renderHook(() => useTrackedState(() => initialState))
  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual(initialState)
  expect(canUndo).toEqual(false)
  expect(canRedo).toEqual(false)
})

test('Should return newState when set', () => {
  const { result } = renderHook(() => useTrackedState<TestData>())

  act(() => {
    result.current[1](initialState)
  })

  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual(initialState)
  expect(canUndo).toEqual(true)
  expect(canRedo).toEqual(false)
})

test('Should do nothing if nothing to undo', () => {
  const { result } = renderHook(() => useTrackedState(initialState))

  act(() => {
    const [, , { undo }] = result.current
    undo()
  })

  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual(initialState)
  expect(canUndo).toEqual(false)
  expect(canRedo).toEqual(false)
})

test('Should do nothing if nothing to redo', () => {
  const { result } = renderHook(() => useTrackedState(initialState))

  act(() => {
    const [, , { redo }] = result.current
    redo()
  })

  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual(initialState)
  expect(canUndo).toEqual(false)
  expect(canRedo).toEqual(false)
})

test('Should be able to set with value', () => {
  const { result } = renderHook(() => useTrackedState(initialState))

  act(() => {
    result.current[1](newState)
  })

  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual(newState)
  expect(canUndo).toEqual(true)
  expect(canRedo).toEqual(false)
})

test('Should be able to set with function', () => {
  const { result } = renderHook(() => useTrackedState(initialState))

  act(() => {
    result.current[1]((current) => ({ ...current, ...newState }))
  })

  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual(newState)
  expect(canUndo).toEqual(true)
  expect(canRedo).toEqual(false)
})

test('Should be able to undo after state change', () => {
  const { result } = renderHook(() => useTrackedState(initialState))

  act(() => {
    result.current[1](newState)
  })

  expect(result.current[0]).toEqual(newState)

  act(() => {
    result.current[2].undo()
  })

  expect(result.current[0]).toEqual(initialState)

  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual(initialState)
  expect(canUndo).toEqual(false)
  expect(canRedo).toEqual(true)
})

test('Should be able to redo after undo change', () => {
  const { result } = renderHook(() => useTrackedState(initialState))

  act(() => {
    result.current[1](newState)
  })

  act(() => {
    result.current[2].undo()
  })

  act(() => {
    result.current[2].redo()
  })

  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual(newState)
  expect(canUndo).toEqual(true)
  expect(canRedo).toEqual(false)
})

test('Should clear redo stack on change', () => {
  const { result } = renderHook(() => useTrackedState(initialState))

  act(() => {
    result.current[1](newState)
  })

  act(() => {
    result.current[2].undo()
  })

  act(() => {
    result.current[1]({ test: 'new' })
  })

  const [value, , { canUndo, canRedo }] = result.current
  expect(value).toEqual({ test: 'new' })
  expect(canUndo).toEqual(true)
  expect(canRedo).toEqual(false)
})
