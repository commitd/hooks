import { renderHook } from '@testing-library/react-hooks'
import { usePoll } from '.'

beforeEach(() => jest.useFakeTimers())

test('Should call handler immediately', () => {
  const handler = jest.fn()
  renderHook(() => usePoll(handler, 1000))
  // Immediate call
  expect(handler).toHaveBeenCalledTimes(1)
})

test('Should call handler immediately n + 1 times according to the `delay`', () => {
  const handler = jest.fn()
  renderHook(() => usePoll(handler, 1000))
  jest.advanceTimersByTime(5000)
  expect(handler).toHaveBeenCalledTimes(6)
})

test('Should pause timer when `delay` is `null`', () => {
  const handler = jest.fn()
  renderHook(() => usePoll(handler, null))

  jest.advanceTimersByTime(5000)
  expect(handler).toHaveBeenCalledTimes(1)
})

test('simpleTimer', async () => {
  async function simpleTimer(callback: () => Promise<void>) {
    await callback()
    setTimeout(() => {
      simpleTimer(callback)
    }, 1000)
  }

  const callback = jest.fn()
  await simpleTimer(callback)
  for (let i = 0; i < 8; i++) {
    jest.advanceTimersByTime(1000)
    await Promise.resolve() // allow any pending jobs in the PromiseJobs queue to run
  }
  expect(callback).toHaveBeenCalledTimes(9) // SUCCESS
})

test('Should only reschedule on completion of the promise', async () => {
  function simpleTimer(callback: () => void) {
    return new Promise((resolve) => {
      callback()
      setTimeout(resolve, 100)
    })
  }

  const callback = jest.fn()
  renderHook(() => usePoll(() => simpleTimer(callback), 100))
  for (let i = 0; i < 8; i++) {
    jest.advanceTimersByTime(100)
    await Promise.resolve() // allow any pending jobs in the PromiseJobs queue to run
  }
  expect(callback).toHaveBeenCalledTimes(5)
})

test('Should change to new handler without resetting the timer', () => {
  const handler1 = jest.fn()
  const handler2 = jest.fn()

  const { rerender } = renderHook(({ handler }) => usePoll(handler, 1000), {
    initialProps: { handler: handler1 },
  })

  jest.advanceTimersByTime(1500)
  rerender({ handler: handler2 })

  jest.advanceTimersByTime(1500)
  expect(handler1).toHaveBeenCalledTimes(2)
  expect(handler2).toHaveBeenCalledTimes(2)
})

test('Should not error if handler null', () => {
  renderHook(({ handler }) => usePoll(handler, 1000), {
    initialProps: { handler: (null as unknown) as () => void },
  })

  jest.advanceTimersByTime(2000)
})

test('Should reset time if passed a new `delay`', () => {
  const handler = jest.fn()

  const { rerender } = renderHook(({ delay }) => usePoll(handler, delay), {
    initialProps: { delay: 500 },
  })

  jest.advanceTimersByTime(1000)
  expect(handler).toHaveBeenCalledTimes(3)

  rerender({ delay: 1000 })
  jest.advanceTimersByTime(3000)
  // note extra call on reset
  expect(handler).toHaveBeenCalledTimes(7)
})
