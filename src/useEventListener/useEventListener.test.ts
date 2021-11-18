import { renderHook } from '@testing-library/react-hooks'
import { RefObject } from 'react'
import { useEventListener } from '.'

interface Handler {
  (e: Event): void
}

test('Should add listener, call handler, and remove listener, all on ref node', () => {
  const listeners: Record<string, Handler> = {}

  const current = ({
    addEventListener: jest.fn((event: string, handler: Handler) => {
      listeners[event] = handler
    }),
    removeEventListener: jest.fn((event: string, _handler: Handler) => {
      delete listeners[event]
    }),
  } as unknown) as HTMLDivElement

  const ref = {
    current,
  } as RefObject<HTMLDivElement>

  const handler = jest.fn()
  const { unmount } = renderHook(() => useEventListener('click', handler, ref))

  expect(listeners.click).toBeTruthy()

  const event = ({} as unknown) as Event
  expect(handler).toHaveBeenCalledTimes(0)
  ;(listeners.click as EventListener)(event)

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler).toHaveBeenCalledWith(event)

  unmount()

  expect(listeners.click).toBeFalsy()
})

test('Should add listener, call handler, and remove listener, all on window', () => {
  const listeners: Record<string, EventListenerOrEventListenerObject> = {}

  jest
    .spyOn(window, 'addEventListener')
    .mockImplementation(
      (
        type: string,
        listener: EventListenerOrEventListenerObject,
        _options?: boolean | AddEventListenerOptions | undefined
      ) => {
        listeners[type] = listener
      }
    )
  jest
    .spyOn(window, 'removeEventListener')
    .mockImplementation(
      (
        type: string,
        _listener: EventListenerOrEventListenerObject,
        _options?: boolean | AddEventListenerOptions | undefined
      ) => {
        delete listeners[type]
      }
    )

  const handler = jest.fn()
  const { unmount } = renderHook(() => useEventListener('mouseout', handler))

  expect(listeners.mouseout).toBeTruthy()

  const event = ({} as unknown) as Event
  expect(handler).toHaveBeenCalledTimes(0)
  ;(listeners.mouseout as EventListener)(event)

  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler).toHaveBeenCalledWith(event)

  unmount()

  expect(listeners.mouseout).toBeFalsy()
})

test('Should cope is handler is null', () => {
  const listeners: Record<string, Handler> = {}

  const current = ({
    addEventListener: jest.fn((event: string, handler: Handler) => {
      listeners[event] = handler
    }),
    removeEventListener: jest.fn((event: string, _handler: Handler) => {
      delete listeners[event]
    }),
  } as unknown) as HTMLDivElement

  const ref = {
    current,
  } as RefObject<HTMLDivElement>
  const { unmount } = renderHook(() => useEventListener('custom', null, ref))

  expect(listeners.custom).toBeTruthy()

  const event = ({} as unknown) as Event

  ;(listeners.custom as EventListener)(event)

  unmount()

  expect(listeners.custom).toBeFalsy()
})

test('Should not listen if development and in production mode', () => {
  const previousEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  try {
    const listeners: Record<string, EventListenerOrEventListenerObject> = {}

    jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(
        (
          type: string,
          listener: EventListenerOrEventListenerObject,
          _options?: boolean | AddEventListenerOptions | undefined
        ) => {
          listeners[type] = listener
        }
      )
    jest
      .spyOn(window, 'removeEventListener')
      .mockImplementation(
        (
          type: string,
          _listener: EventListenerOrEventListenerObject,
          _options?: boolean | AddEventListenerOptions | undefined
        ) => {
          delete listeners[type]
        }
      )

    const handler = jest.fn()
    const { unmount } = renderHook(() =>
      useEventListener('mouseout', handler, undefined, true)
    )
    expect(listeners.mouseout).toBeFalsy()
    unmount()

    expect(listeners.mouseout).toBeFalsy()
  } finally {
    process.env.NODE_ENV = previousEnv
  }
})
