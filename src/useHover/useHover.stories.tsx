import { Box } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React, { RefObject } from 'react'
import { useHover } from '.'

export interface UseHoverDocsProps<T extends HTMLElement> {
  /** element reference to track hover on, T extends `HTMLElement` */
  element?: RefObject<T>
}

/**
 * useHover tracks the hovered state of the given element.
 *
 * @param element reference for the element to add the listener too
 */
export const UseHoverDocs = <T extends HTMLElement>(
  props: UseHoverDocsProps<T>
) => null

export default {
  title: 'Hooks/useHover',
  component: UseHoverDocs,
  excludeStories: ['UseHoverDocs'],
  argTypes: {
    element: { control: { type: 'none' } },
  },
} as Meta

const Template: Story<UseHoverDocsProps<HTMLDivElement>> = () => {
  const divRef = React.useRef<HTMLDivElement>(null)
  const [isHovered] = useHover(divRef)
  return (
    <Box
      css={{
        m: '$3',
        p: '$3',
        backgroundColor: isHovered ? '$primary' : '$primaryContrast',
        color: isHovered ? '$primaryContrast' : '$primary',
      }}
      ref={divRef}
    >{`This is ${isHovered ? `hovered` : `unhovered`}`}</Box>
  )
}

export const Default = Template.bind({})
