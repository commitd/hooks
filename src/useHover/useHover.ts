import { RefObject, useState } from 'react'
import { useEventListener } from '../useEventListener/useEventListener'

/**
 * useHover tracks the hovered state of the given element.
 *
 * @param element reference to track hover on
 */
export function useHover<T extends HTMLElement = HTMLDivElement>(
  element: RefObject<T>
): [boolean] {
  const [hovered, setHovered] = useState(false)

  const handleMouseOver = () => setHovered(true)
  const handleMouseOut = () => setHovered(false)

  useEventListener('mouseover', handleMouseOver, element)
  useEventListener('mouseout', handleMouseOut, element)

  return [hovered]
}
