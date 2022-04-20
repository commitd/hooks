import { act, renderHook } from '@testing-library/react-hooks'
import { useControllableState } from '.'

let spy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>
interface TestArgs {
  value: boolean | undefined
  setValue: React.Dispatch<React.SetStateAction<boolean>> | undefined
}

type TestReturn = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

const value = true
const altValue = false
let setValue: jest.Mock<any, any>

beforeEach(() => {
  setValue = jest.fn()
  spy = jest.spyOn(console, 'warn').mockImplementation()
})

afterEach(() => {
  spy.mockRestore()
})

test('Should provide initial output as setState when uncontrolled', () => {
  const { result } = renderHook(() =>
    useControllableState(undefined, undefined)
  )
  expect(result.current[0]).toBeUndefined()
  expect(typeof result.current[1]).toBe('function')
})

test('Should use default value if not controlled', () => {
  const { result } = renderHook(() =>
    useControllableState(undefined, undefined, value)
  )
  expect(result.current[0]).toBe(value)
})

test('Should call default initializer not controlled', () => {
  const initializer = jest.fn().mockImplementation(() => value)

  const { result } = renderHook(() =>
    useControllableState(undefined, undefined, initializer)
  )
  expect(result.current[0]).toBe(value)
  expect(initializer).toHaveBeenCalled()
})

test('Should provide initial output as setState when controlled', () => {
  const { result } = renderHook(() => useControllableState(true, setValue))
  expect(result.current[0]).toBe(value)
  expect(typeof result.current[1]).toBe('function')
})

test('Should not use initializer if controlled', () => {
  const { result } = renderHook(() =>
    useControllableState(value, setValue, false)
  )
  expect(result.current[0]).toBe(value)
})

test('Should not call default initializer controlled', () => {
  const initializer = jest.fn().mockImplementation(() => value)

  const { result } = renderHook(() =>
    useControllableState(value, setValue, initializer)
  )
  expect(result.current[0]).toBe(value)
  expect(initializer).not.toHaveBeenCalled()
})

test('setValue should change value when uncontrolled', () => {
  const { result } = renderHook(() =>
    useControllableState<boolean | undefined>(undefined, undefined)
  )

  const value = true

  act(() => {
    result.current[1](value)
  })
  expect(result.current[0]).toEqual(value)
})

test('setValue should call supplied function when controlled', () => {
  const { result } = renderHook(() =>
    useControllableState<boolean | undefined>(value, setValue)
  )

  act(() => {
    result.current[1](altValue)
  })
  expect(result.current[0]).toEqual(value)
  expect(setValue).toHaveBeenCalledWith(altValue)
})

test('should warn if switching from uncontrolled to controlled', () => {
  const { rerender } = renderHook<TestArgs, TestReturn>(
    ({ value, setValue }) =>
      useControllableState<boolean>(value, setValue, false),
    { initialProps: { value: undefined, setValue: undefined } }
  )

  rerender({ value: value, setValue: setValue })
  expect(console.warn).toHaveBeenCalledTimes(1)
})

test('should warn if switching from uncontrolled to controlled', () => {
  const { rerender } = renderHook<TestArgs, TestReturn>(
    ({ value, setValue }) =>
      useControllableState<boolean>(value, setValue, false),
    { initialProps: { value: value, setValue: setValue } }
  )

  rerender({ value: undefined, setValue: undefined })
  expect(console.warn).toHaveBeenCalledTimes(1)
})

test('Should not warn in production mode', () => {
  const previousEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  try {
    const { rerender } = renderHook<TestArgs, TestReturn>(
      ({ value, setValue }) =>
        useControllableState<boolean>(value, setValue, false),
      { initialProps: { value: value, setValue: setValue } }
    )

    rerender({ value: undefined, setValue: undefined })
    expect(console.warn).toHaveBeenCalledTimes(0)
  } finally {
    process.env.NODE_ENV = previousEnv
  }
})
