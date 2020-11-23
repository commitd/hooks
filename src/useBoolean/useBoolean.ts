import React, { useState } from 'react'

/**
 * Utility hook for boolean state
 *
 * returns the value, an object containing function for toggle, setTrue and setFalse.
 *
 * Use with caution, attaching to buttons can cause unintended consequences from double clicks.
 * @params startState (optional) starting value
 */
export function useBoolean(
  startState = false
): [
  boolean,
  {
    toggle: () => void
    setTrue: () => void
    setFalse: () => void
  }
] {
  const [value, setValue] = useState(startState)

  const functions = React.useMemo(
    () => ({
      toggle: (): void => setValue((state) => !state),
      setTrue: (): void => setValue(true),
      setFalse: (): void => setValue(false),
    }),
    [setValue]
  )

  return [value, functions]
}
