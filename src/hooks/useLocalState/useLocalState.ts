import React, { Dispatch } from 'react'

/**
 * Serialize the value to a string
 */
export interface Serializer<T> {
  (state: T): string
}

/**
 * Deserialize the value from a string
 */
export interface Deserializer<T> {
  (serialized: string): T
}

/**
 * Default function type guard
 * @param defaultValue
 */
function isFunction<T>(
  defaultValue: T | (() => T) | undefined
): defaultValue is () => T {
  return typeof defaultValue === 'function'
}

/**
 * useLocalState hook behaves like `React.useState`, returning the state and a function to set the value.
 * In addition, the value is put in local storage against the given key and is persisted through page refresh.
 */
export function useLocalState<T>(
  key: string,
  defaultValue?: T | (() => T),
  {
    serialize,
    deserialize,
  }: {
    serialize: Serializer<T>
    deserialize: Deserializer<T>
  } = { serialize: JSON.stringify, deserialize: JSON.parse }
): [T, Dispatch<T>, () => void] {
  const [state, setState] = React.useState<T>(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage != null) {
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    if (isFunction(defaultValue)) {
      return defaultValue()
    } else {
      return defaultValue as T
    }
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    if (state === undefined || state === null) {
      window.localStorage.removeItem(key)
    } else {
      window.localStorage.setItem(key, serialize(state))
    }
  }, [key, state, serialize])

  const clear = React.useCallback(() => {
    window.localStorage.removeItem(key)
  }, [key])

  return [state, setState, clear]
}
