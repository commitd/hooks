import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Button, Loader } from '@committed/components'
import { useToggle } from '.'

export interface UseToggleDocsProps {
  /** The start state for the toggle */
  defaultValue: boolean
}

/**
 * Utility hook for boolean toggle operations
 *
 * __Use with caution__, attaching to buttons can cause unintended consequences from double clicks.
 *
 * returns the value, a toggle function, and the original setValue in case required.
 */
export const UseToggleDocs: React.FC<UseToggleDocsProps> = (
  _props: UseToggleDocsProps
) => null
UseToggleDocs.defaultProps = { defaultValue: true }

export default {
  title: 'Hooks/useToggle',
  component: UseToggleDocs,
  excludeStories: ['UseToggleDocs'],
} as Meta

const Template: Story<UseToggleDocsProps> = ({ defaultValue }) => {
  const [spin, toggleSpin] = useToggle(defaultValue)
  return (
    <>
      <Button color="primary" onClick={toggleSpin}>
        Toggle
      </Button>
      <Loader variant="spin" loading={spin} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = { defaultValue: false }

export const DefaultTrue = Template.bind({})
DefaultTrue.args = { defaultValue: true }

DefaultTrue.parameters = {
  docs: {
    description: {
      story: 'The default start state can be set, and defaults to `false`',
    },
  },
}
