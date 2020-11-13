import { useEffect, useRef } from 'react'

/**
 * Call the callback with a fixed delay (between completions)
 *
 * The first call will be made immediately.
 *
 * Based on https://www.aaron-powell.com/posts/2019-09-23-recursive-settimeout-with-react-hooks/
 *
 *
 * @param callback the callback
 * @param delay the time between calls (ms)
 */
export function usePoll(
  callback: (() => Promise<void>) | (() => void) | null,
  delay: number | null
): void {
  const savedCallback = useRef<(() => Promise<void>) | (() => void) | null>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    let id: NodeJS.Timeout | null = null

    function call() {
      const current = savedCallback.current
      let ret = undefined
      if (current != null) {
        ret = current()
      }
      return ret
    }

    function reschedule(): void {
      if (delay !== null) {
        id = setTimeout(tick, delay)
      }
    }

    function tick(): void {
      const ret = call()

      if (ret instanceof Promise) {
        void ret.then(reschedule)
      } else {
        reschedule()
      }
    }

    tick()

    return () => {
      id && clearTimeout(id)
      id = null
    }
  }, [delay])
}
