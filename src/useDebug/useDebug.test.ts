import { renderHook } from '@testing-library/react-hooks'
import { useDebug } from '.'

let spy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>

const initialProps = {
  test: 'string',
  count: 123,
  object: { key: 'value' },
}

const initialState = {
  test: 'string',
  count: 123,
  object: { key: 'value' },
}

beforeEach(() => {
  spy = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(() => {
  spy.mockRestore()
})

test('Should default missing values', () => {
  renderHook(() => useDebug('test'))
  expect(console.log).toHaveBeenCalledTimes(0)
})
test('Should default missing state', () => {
  renderHook((data) => useDebug('test', data), {
    initialProps: initialProps,
  })
  expect(console.log).toHaveBeenCalledTimes(0)
})

test('Should not log on initial render', () => {
  renderHook((data) => useDebug('test', data.props, data.state), {
    initialProps: { props: initialProps, state: initialState },
  })
  expect(console.log).toHaveBeenCalledTimes(0)
})

test('Should not log if rerender with same data', () => {
  const { rerender } = renderHook(
    (data) => useDebug('test', data.props, data.state),
    { initialProps: { props: initialProps, state: initialState } }
  )
  rerender({ props: initialProps, state: initialState })
  expect(console.log).toHaveBeenCalledTimes(0)
})

test('Should not log if rerender with equal data', () => {
  const { rerender } = renderHook(
    (data) => useDebug('test', data.props, data.state),
    { initialProps: { props: initialProps, state: initialState } }
  )
  rerender({ props: { ...initialProps }, state: { ...initialState } })
  expect(console.log).toHaveBeenCalledTimes(0)
})

test('Should log if rerender with different props', () => {
  const { rerender } = renderHook(
    (data) => useDebug('test', data.props, data.state),
    { initialProps: { props: initialProps, state: initialState } }
  )
  rerender({
    props: { ...initialProps, ...{ test: 'changed' } },
    state: initialState,
  })
  expect(console.log).toHaveBeenCalledTimes(1)
})

test('Should log if rerender with different state', () => {
  const { rerender } = renderHook(
    (data) => useDebug('test', data.props, data.state),
    { initialProps: { props: initialProps, state: initialState } }
  )
  rerender({
    props: initialProps,
    state: { ...initialState, ...{ count: 321 } },
  })
  expect(console.log).toHaveBeenCalledTimes(1)
})

test('Should log if rerender with different keys', () => {
  const { rerender } = renderHook(
    (data) => useDebug('test', data.props, data.state),
    { initialProps: { props: initialProps, state: initialState } }
  )
  rerender({
    props: initialProps,
    state: { ...initialState, ...{ additional: [] } },
  })
  expect(console.log).toHaveBeenCalledTimes(1)
})

test('Should not log in production mode', () => {
  const previousEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  try {
    const { rerender } = renderHook(
      (data) => useDebug('test', data.props, data.state),
      { initialProps: { props: initialProps, state: initialState } }
    )
    rerender({
      props: initialProps,
      state: { ...initialState, ...{ count: 321 } },
    })
    expect(console.log).toHaveBeenCalledTimes(0)
  } finally {
    process.env.NODE_ENV = previousEnv
  }
})
