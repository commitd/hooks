import { RefObject, useCallback, useEffect, useMemo, useRef } from 'react'
import { useEventListener } from '../useEventListener/useEventListener'

export const KEYBOARD_MODIFIERS = ['Alt', 'Control', 'Meta', 'OS', 'Shift']

const MODIFIER_ALIASES: Record<string, string | undefined> = {
  alt: 'Alt',
  ctrl: 'Control',
  control: 'Control',
  shift: 'Shift',
  meta: 'Meta',
  option: 'Alt',
}

const KEY_ALIASES: Record<string, string> = {
  plus: '+',
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  space: ' ',
  esc: 'Escape',
}

export interface KeyFilter {
  (event: KeyboardEvent): boolean
}

export type Keys = string | Array<string> | KeyFilter

export interface KeyboardFilterOptions {
  ignoreKey: boolean
  ignoreRepeat: boolean
}

export interface KeyboardOptions<T extends HTMLElement>
  extends Partial<KeyboardFilterOptions> {
  element?: RefObject<T>
  event?: 'keydown' | 'keyup'
  development?: boolean
}

function isKeyFilter(input: Keys): input is KeyFilter {
  return typeof input === 'function'
}

function isKeyArray(input: Keys): input is Array<string> {
  return Array.isArray(input)
}

const DEFAULT_KEYBOARD_FILTER_OPTIONS = {
  ignoreKey: false,
  ignoreRepeat: false,
}

function eventLength(e: KeyboardEvent): number {
  let length = 0
  KEYBOARD_MODIFIERS.forEach((modifier) => {
    if (e.getModifierState(modifier)) {
      length++
    }
  })
  if (!KEYBOARD_MODIFIERS.includes(e.key)) {
    length++
  }
  return length
}

function createKeysFilter(keys: string, options: KeyboardFilterOptions) {
  // Convenience code for any key
  if (keys === '') {
    return () => true
  }
  return (e: KeyboardEvent) => {
    if (options.ignoreRepeat && e.repeat) {
      return false
    }

    const splitKeys = keys.split('+').filter((key) => key.length > 0)
    if (splitKeys.length !== eventLength(e)) {
      return false
    }
    return splitKeys.every((key) => {
      const modifier = MODIFIER_ALIASES[key.toLowerCase()] ?? key
      if (e.getModifierState(modifier)) {
        return true
      }
      if (e.key === key || e.key === KEY_ALIASES[key.toLowerCase()]) {
        return true
      }
      if (e.key.length > 1 && e.key.toLowerCase() === key.toLowerCase()) {
        return true
      }
      if (
        e.code === key ||
        (!options.ignoreKey && e.code === 'Key' + key.toUpperCase())
      ) {
        return true
      }
      return false
    })
  }
}

/**
 * useKeyboard hook to add a callback to be called on the use of the keyboard under specified circumstances.
 *
 *
 * @param keys {Keys} The definition of the key filter.
 * The basic definition is a string filter separated with the `+` e.g. `'a'` or `'ctrl+a'`
 * An array can be provided with alternatives, so matching any filter in the array will call the handler.
 * Finally, you can provide your own function `(event: KeyboardEvent) => boolean`
 * @param handler {((event: KeyboardEvent) => void) | null} the callback function to call on a key event firing and passing the filter
 * @param options options options object
 * @param options.element {RefObejct} provide a ref for the element to bind to (defaults to `window`)
 * @param options.event {keyup | keydown} a ref for the element to bind to (defaults to `keydown`)
 * @param options.ignoreKey {boolean} set `true` to turn off the `KeyCode` test no other match (defaults to `false`)
 * @param options.ignoreRepeat {boolean} set `true` to ignore repeat events (defaults to `false`)
 * @param options.development {boolean} set `true` to remove in production, using `process.env.NODE_ENV` (defaults to `false`)
 */
export function useKeyboard<T extends HTMLElement = HTMLDivElement>(
  keys: Keys,
  handler: ((event: KeyboardEvent) => void) | null,
  options: KeyboardOptions<T> = {}
): void {
  const savedHandler = useRef<((event: KeyboardEvent) => void) | null>()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  const { element, event = 'keydown', development } = options
  const {
    ignoreKey = DEFAULT_KEYBOARD_FILTER_OPTIONS.ignoreKey,
    ignoreRepeat = DEFAULT_KEYBOARD_FILTER_OPTIONS.ignoreRepeat,
  } = options

  const keyFilter: KeyFilter = useMemo(() => {
    const filterOptions = {
      ignoreKey,
      ignoreRepeat,
    }
    if (isKeyFilter(keys)) {
      return keys
    }
    if (isKeyArray(keys)) {
      return (e: KeyboardEvent) =>
        keys
          .map((key) => createKeysFilter(key, filterOptions))
          .some((filter) => filter(e))
    } else {
      return createKeysFilter(keys, filterOptions)
    }
  }, [keys, ignoreKey, ignoreRepeat])

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (savedHandler.current == null) {
        return
      }
      if (keyFilter(e)) {
        savedHandler.current(e)
      }
    },
    [keyFilter]
  )

  useEventListener(event, keyHandler, element, development)
}
