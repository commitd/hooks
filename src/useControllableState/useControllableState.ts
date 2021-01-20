import { useEffect, useRef, useState } from 'react'

/** type guard to check if value or function */
function isValue<T>(arg: T | (() => T | undefined)): arg is T {
  return typeof arg !== 'function'
}

/** no operation  */
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

/**
 * useControllableState hook for when the state may be controlled or uncontrolled.
 *
 * Returns as the standard useState hook, but has additional props of a controlled value and a controlled change handler.
 * Set these using the components incoming props for the state, if defined they will be used, if not you get the standard useState behaviour.
 *
 * @param {T | undefined} value The controlled value (of type T) or undefined for an uncontrolled value
 * @param {React.Dispatch<React.SetStateAction<T>> | undefined} setValue  The dispatch handler for state changes or undefined for when an uncontrolled value, ignored if uncontrolled
 * @param {T | (() => T | undefined) | undefined} initialState  The initial state value, or state initializer for when uncontrolled, ignored if controlled
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useControllableState<T = any>(
  value: T | undefined,
  setValue: React.Dispatch<React.SetStateAction<T>> | undefined,
  initialState?: T | (() => T | undefined) | undefined
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { current: wasControlled } = useRef(value !== undefined)
  const isControlled = value !== undefined

  const [uncontrolled, setUncontrolled] = useState<T | undefined>(() => {
    if (value === undefined) {
      if (initialState !== undefined) {
        return isValue(initialState) ? initialState : initialState()
      }
    }
    return undefined
  })
  let effect = noop
  if (process.env.NODE_ENV !== 'production') {
    effect = function () {
      if (wasControlled !== isControlled) {
        console.warn(
          'Components should not switch from uncontrolled to controlled (or vice versa)'
        )
      }
    }
  }
  useEffect(effect, [isControlled])

  return [
    (wasControlled ? value : uncontrolled) as T,
    (wasControlled ? setValue : setUncontrolled) as React.Dispatch<
      React.SetStateAction<T>
    >,
  ]
}
