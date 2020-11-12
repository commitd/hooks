import { useEffect, useRef } from 'react'

/**
 * Call the callback at the given rate.
 *
 * Based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback the callback
 * @param delay the time between calls (ms)
 */
export function useInterval(
  callback: (() => void) | null,
  delay: number | null
): void {
  const savedCallback = useRef<(() => void) | null>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick(): void {
      const current = savedCallback.current
      if (current != null) current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    } else {
      return
    }
  }, [delay])
}
