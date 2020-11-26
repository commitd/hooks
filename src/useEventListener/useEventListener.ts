import { useRef, useEffect, RefObject } from 'react'

/**
 * useEventListener hook adds an event listener to the given event type and calls the handler when fired.
 * The listener is added to the `window` by default or the target element if provided using a ref object.
 * It is removed automatically on unmounting.
 *
 * For event types reference see <https://developer.mozilla.org/en-US/docs/Web/Events>.
 *
 * (Derived from <https://usehooks-typescript.com/use-event-listener>)
 *
 * @param eventName the name of the event to listen to
 * @param handler the callback function to call on the event firing
 * @param element (optional) reference for the element to add the listener to
 */
export function useEventListener<
  T extends HTMLElement = HTMLDivElement,
  E extends Event = Event
>(
  eventName: string,
  handler: ((event: E) => void) | null,
  element?: RefObject<T>
): void {
  const savedHandler = useRef<((event: E) => void) | null>()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    function eventListener(event: Event): void {
      const current = savedHandler.current
      if (current != null) current(event as E)
    }

    const targetElement: T | Window = element?.current ?? window
    targetElement.addEventListener(eventName, eventListener)

    return () => {
      targetElement.removeEventListener(eventName, eventListener)
    }
    // False positive request for E and T
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, element])
}
