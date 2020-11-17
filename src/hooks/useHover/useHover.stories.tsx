import React, { RefObject } from 'react'
import { Story, Meta } from '@storybook/react'
import { Box } from '@committed/components'
import { useHover } from '.'

export interface UseHoverDocsProps<T extends HTMLElement> {
  /** element reference to track hover on */
  element?: RefObject<T>
}

/**
 * useHover tracks the hovered state of the given element.
 *
 * @param element reference for the element to add the listener too
 */
export const UseHoverDocs: React.FC<UseHoverDocsProps<HTMLElement>> = () => null

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
      m={3}
      p={3}
      ref={divRef}
      bgcolor={isHovered ? 'primary.main' : 'secondary.main'}
      color={isHovered ? 'primary.contrastText' : 'secondary.contrastText'}
    >{`This is ${isHovered ? `hovered` : `unhovered`}`}</Box>
  )
}

export const Default = Template.bind({})
