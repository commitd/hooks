import { useBoolean } from '../useBoolean'

/**
 * Utility hook for modal state
 *
 * returns  visibility state of modal and show and hide functions.
 *
 * @params startState (optional) starting value
 */
export function useModal(
  startState = false
): [visible: boolean, show: () => void, hide: () => void] {
  const [visible, { setTrue: show, setFalse: hide }] = useBoolean(startState)
  return [visible, show, hide]
}
