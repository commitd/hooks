import { act, renderHook } from '@testing-library/react-hooks'
import { useClipboard } from '.'

test('Should set error if clipboard not supported', () => {
  const { result } = renderHook(() => useClipboard())

  act(() => {
    result.current.copy('test')
  })

  expect(result.current.copied).toBeFalsy()
  expect(result.current.error).toBeDefined()
})

describe('useClipboard with mock', () => {
  const originalClipboard = { ...global.navigator.clipboard }

  beforeEach(() => {
    jest.useFakeTimers()
    const mockClipboard = {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    }
    //@ts-ignore
    global.navigator.clipboard = mockClipboard
  })

  afterEach(() => {
    jest.resetAllMocks()
    //@ts-ignore
    global.navigator.clipboard = originalClipboard
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  test('Should provide initial output as not copied', () => {
    const { result } = renderHook(() => useClipboard())
    expect(result.current.copied).toBeFalsy()
    expect(result.current.error).toBeUndefined()
  })

  test('Should set copied value on copy', async () => {
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('test')
    })

    expect(result.current.copied).toBeTruthy()
    expect(result.current.error).toBeUndefined()
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith('test')
  })

  test('Should set copied value on copy and then timeout', async () => {
    const { result } = renderHook(() => useClipboard(10))

    await act(async () => {
      await result.current.copy('test')
    })

    expect(result.current.copied).toBeTruthy()

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(result.current.copied).toBeFalsy()
  })

  test('Should set error if copy error', async () => {
    const mockClipboard = {
      writeText: jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('test'))),
    }
    //@ts-ignore
    global.navigator.clipboard = mockClipboard

    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('test')
    })

    expect(result.current.copied).toBeFalsy()
    expect(result.current.error).toBeDefined()

    act(() => {
      result.current.reset()
    })
    expect(result.current.copied).toBeFalsy()
    expect(result.current.error).toBeUndefined()
  })

  test('Should reset copied value on multiple copy', async () => {
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('test1')
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await act(async () => {
      await result.current.copy('test2')
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.copied).toBeTruthy()
    expect(result.current.error).toBeUndefined()

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.copied).toBeFalsy()

    act(() => {
      result.current.reset()
    })

    expect(result.current.copied).toBeFalsy()

    expect(global.navigator.clipboard.writeText).toHaveBeenCalledTimes(2)
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith('test1')
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith('test2')
  })
})
