import { useEffect, useState } from 'react'

/**
 * Debounce the update to a value.
 *
 * The returned value will only update when the useDebounce hook has not been called for the full delay specified.
 *
 * A set function is also returned so the value can be forced or flushed, say on dismount.
 *
 * Adapted from <https://usehooks.com/>.
 *
 * @param value The value to debounce updates for
 * @param delay The time to delay updates by (ms)
 */
export function useDebounce<T>(
  value: T,
  delay: number | null
): [T, () => void] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    if (delay !== null) {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    } else {
      setDebouncedValue(value)
      return
    }
  }, [value, delay])

  const flush = () => setDebouncedValue(value)

  return [debouncedValue, flush]
}
