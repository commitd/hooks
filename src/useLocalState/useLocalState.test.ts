import { act, renderHook } from '@testing-library/react-hooks'
import { useLocalState } from '.'

const storageKey = 'test'
const altKey = 'testing'

beforeEach(() => {
  window.localStorage.removeItem(storageKey)
  window.localStorage.removeItem(altKey)
})

test('Should provide initial output with given default value and store it in local storage', () => {
  const { result: first } = renderHook(() =>
    useLocalState(storageKey, 'default')
  )
  expect(first.current[0]).toEqual('default')
  expect(typeof first.current[1]).toEqual('function')

  expect(window.localStorage.getItem(storageKey)).toEqual('"default"')
})

test('Should provide initial output with given default value from function and store it in local storage', () => {
  const { result: first } = renderHook(() =>
    useLocalState(storageKey, () => 'default')
  )
  expect(first.current[0]).toEqual('default')
  expect(typeof first.current[1]).toEqual('function')

  expect(window.localStorage.getItem(storageKey)).toEqual('"default"')
})

test('Should get initial output from local storage when present', () => {
  window.localStorage.setItem(storageKey, '"stored"')
  const { result: first } = renderHook(() => useLocalState(storageKey))
  expect(first.current[0]).toEqual('stored')
  expect(typeof first.current[1]).toEqual('function')

  expect(window.localStorage.getItem(storageKey)).toEqual('"stored"')
})

test('Should clear value from local storage if can not parse', () => {
  window.localStorage.setItem(storageKey, '"{stored : error')
  const { result: first } = renderHook(() => useLocalState(storageKey))
  expect(first.current[0]).toEqual(undefined)
  expect(typeof first.current[1]).toEqual('function')

  expect(window.localStorage.getItem(storageKey)).toBe(null)
})

test('Should clear value from local storage and use supplied default if can not parse', () => {
  window.localStorage.setItem(storageKey, '"{stored : error')
  const { result: first } = renderHook(() => useLocalState(storageKey, 10))
  expect(first.current[0]).toEqual(10)
  expect(typeof first.current[1]).toEqual('function')

  expect(window.localStorage.getItem(storageKey)).toBe('10')
})

test('Should update local storage on setState', () => {
  const { result } = renderHook(() => useLocalState(storageKey, 'first'))

  act(() => {
    result.current[1]('second')
  })

  expect(result.current[0]).toEqual('second')
  expect(window.localStorage.getItem(storageKey)).toBe('"second"')
})

test('Should clear the local storage on use of clear function', () => {
  let { result } = renderHook(() => useLocalState(storageKey, 'clear'))

  act(() => {
    result.current[1]('edited')
  })

  expect(result.current[0]).toEqual('edited')

  act(() => {
    // clear()
    result.current[2]()
  })

  // value remains unchanged
  expect(result.current[0]).toEqual('edited')
  // but local storage empty
  expect(window.localStorage.getItem(storageKey)).toBe(null)

  result = renderHook(() => useLocalState(storageKey, 'clear')).result

  // refresh should return us to default value
  expect(result.current[0]).toEqual('clear')
})

test('Should update local storage on key change', () => {
  const { result, rerender } = renderHook(
    ({ key, defaultValue }) => useLocalState(key, defaultValue),
    {
      initialProps: { key: storageKey, defaultValue: 'first' },
    }
  )

  rerender({ key: altKey, defaultValue: 'first' })

  expect(result.current[0]).toEqual('first')
  expect(window.localStorage.getItem(storageKey)).toBe(null)
  expect(window.localStorage.getItem(altKey)).toBe('"first"')
})

type Mode = 'light' | 'dark'

test('Should allow custom serialisation', () => {
  const serialisation = {
    serialize: (mode: Mode) => (mode === 'light' ? 'l' : 'd'),
    deserialize: (serialized: string) =>
      serialized === 'l' ? 'light' : 'dark',
  }

  const { result } = renderHook(() =>
    useLocalState(storageKey, undefined, serialisation)
  )
  expect(result.current[0]).toBe(undefined)
  expect(window.localStorage.getItem(storageKey)).toBe(null)
  act(() => {
    result.current[1]('dark')
  })
  expect(result.current[0]).toBe('dark')
  expect(window.localStorage.getItem(storageKey)).toBe('d')

  const refreshed = renderHook(() =>
    useLocalState(storageKey, undefined, serialisation)
  )
  expect(refreshed.result.current[0]).toBe('dark')
})
