import { useLayoutEffect, useRef } from 'react'

export interface Options {
  /** Set true to append the given string to the current title */
  append?: boolean
  /** Set true to keep the title even after the component has unmounted */
  retain?: boolean
  /** The separator to use when appending */
  separator?: string
}

const DEFAULT_OPTIONS = {
  append: false,
  retain: false,
  separator: '',
}

/**
 * useTitle hook allows you to control the document title from your component.
 *
 * @param title The string to set the title to or to be appended.
 * @param options The options to configure the useTitle
 * @param options.append Set true to append the given string to the current title
 * @param options.retain Set true to keep the title even after the component has unmounted
 * @param options.separator The separator to use when appending
 */
export function useTitle(title: string, options: Options = {}): void {
  const {
    append = DEFAULT_OPTIONS.append,
    retain = DEFAULT_OPTIONS.retain,
    separator = DEFAULT_OPTIONS.separator,
  } = options
  const titleRef = useRef(document.title)

  useLayoutEffect(() => {
    titleRef.current = document.title
    if (!retain) {
      return () => {
        document.title = titleRef.current
      }
    } else {
      return
    }
  }, [retain])

  useLayoutEffect(() => {
    if (append) {
      document.title = titleRef.current + separator + title
    } else {
      document.title = title
    }
  }, [title, separator, append])
}
