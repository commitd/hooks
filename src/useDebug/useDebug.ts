/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Data = Record<string, any>
export type Props = Data
export type State = Data

function changed(previous: Data, current: Data): Data {
  const allKeys = Object.keys({ ...previous, ...current })
  const changed: Data = {}

  allKeys.forEach((key) => {
    if (previous[`${key}`] !== current[`${key}`]) {
      changed[`${key}`] = {
        from: previous[`${key}`],
        to: current[`${key}`],
      }
    }
  })
  return changed
}

/**
 * useDebug hook will log props and state changes to help identify the cause and frequency of component updates, when not in `production`.
 *
 * @param name the name for this component instance
 * @param props the props for the component
 * @param state the state for the component
 */
export function useDebug(
  name: string,
  props: Props = {},
  state: State = {}
): void {
  const prevProps = useRef<Props>(props)
  const prevState = useRef<State>(state)

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return
    }
    const changedProps = changed(prevProps.current, props)
    const changedState = changed(prevState.current, state)

    if (Object.keys({ ...changedProps, ...changedState }).length) {
      console.log(
        `${name} updated:`,
        'props',
        changedProps,
        'state',
        changedState
      )
    }

    prevProps.current = props
    prevState.current = state
  })
}
