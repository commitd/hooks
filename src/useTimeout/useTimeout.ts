import { useEffect, useRef } from 'react'

/**
 * Call the callback after a period of delay.
 *
 * Based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback the callback
 * @param delay the timeout before the call (in ms)
 */
export function useTimeout(
  callback: () => void | null,
  delay: number | null
): void {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick(): void {
      const current = savedCallback.current
      if (current != null) current()
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay)
      return () => clearTimeout(id)
    } else {
      return
    }
  }, [delay])
}
