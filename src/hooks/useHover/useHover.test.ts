import { renderHook, act } from '@testing-library/react-hooks'
import { useHover } from '.'
import { RefObject } from 'react'

let listeners: Record<string, () => void>
let ref: RefObject<HTMLDivElement>

beforeEach(() => {
  listeners = {}

  const current = ({
    addEventListener: jest.fn((event: string, handler: () => void) => {
      listeners[event] = handler
    }),
    removeEventListener: jest.fn((event: string) => {
      delete listeners[event]
    }),
  } as unknown) as HTMLDivElement

  ref = {
    current,
  } as RefObject<HTMLDivElement>
})

test('Should start with hover false', () => {
  const { result } = renderHook(() => useHover(ref))
  expect(result.current[0]).toEqual(false)
})

test('Should be true if mouseover', () => {
  const { result } = renderHook(() => useHover(ref))
  act(() => {
    const event = ({} as unknown) as Event
    ;(listeners.mouseover as EventListener)(event)
  })
  expect(result.current[0]).toEqual(true)
})

test('Should be false if mouseout', () => {
  const { result } = renderHook(() => useHover(ref))

  act(() => {
    const event = ({} as unknown) as Event
    ;(listeners.mouseout as EventListener)(event)
  })

  expect(result.current[0]).toEqual(false)
})

test('Should be toggle if mouseover then mouseout', () => {
  const { result } = renderHook(() => useHover(ref))

  act(() => {
    const event = ({} as unknown) as Event
    ;(listeners.mouseover as EventListener)(event)
  })
  expect(result.current[0]).toEqual(true)

  act(() => {
    const event = ({} as unknown) as Event
    ;(listeners.mouseout as EventListener)(event)
  })

  expect(result.current[0]).toEqual(false)
})

test('Should remove listeners', () => {
  const { unmount } = renderHook(() => useHover(ref))

  unmount()

  expect(listeners.mouseover).toBeFalsy()
  expect(listeners.mouseout).toBeFalsy()
})
