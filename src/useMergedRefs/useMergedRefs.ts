import React, { useMemo } from 'react'

type Ref<T> =
  | React.RefCallback<T | null>
  | React.MutableRefObject<T | null>
  | undefined
  | null

/**
 * useMergedRefs merges the passed refs into a single memoized ref function.
 *
 * ```ts
 * const ExampleComponent = React.forwardRef((props, forwardedRef) => {
 *   const ref = React.useRef();
 *   return <div {...props} ref={useMergeRefs(ref, forwardedRef)} />;
 * });
 * ```
 *
 * @param refs spread array of refs to be merged
 */
export function useMergedRefs<T>(
  ...refs: Ref<T>[]
): React.RefCallback<T> | null {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null
    }
    return (value: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(value)
        } else if (ref != null && 'current' in ref) {
          ref.current = value
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs)
}
