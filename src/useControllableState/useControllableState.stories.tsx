import React from 'react'
import { Story, Meta } from '@storybook/react'
import { useControllableState } from '.'
import { CheckToken } from '@committed/components'
import { action } from '@storybook/addon-actions'

export interface UseControllableStateDocsProps<T> {
  /** The controlled value (of type T) or undefined for an uncontrolled value */
  value: T | undefined
  /** The dispatch handler for state changes or undefined for when an uncontrolled value, ignored if uncontrolled*/
  setValue: React.Dispatch<React.SetStateAction<T>> | undefined
  /** The initial state value, or state initializer for when uncontrolled, ignored if controlled  */
  initialState?: T | (() => T | undefined) | undefined
}

/**
 * useControllableState hook for when the state may be controlled or uncontrolled.
 *
 * Returns as the standard useState hook, but has additional props of a controlled value and a controlled change handler.
 * Set these using the components incoming props for the state, if defined they will be used, if not you get the standard useState behaviour.
 */
export const UseControllableStateDocs = <T extends any>(
  props: UseControllableStateDocsProps<T>
) => null

export default {
  title: 'Hooks/useControllableState',
  component: UseControllableStateDocs,
  excludeStories: ['UseControllableStateDocs'],
} as Meta

const Template: Story<UseControllableStateDocsProps<boolean>> = ({
  value,
  setValue,
}) => {
  const [state, setState] = useControllableState(value, setValue, false)
  return (
    <CheckToken
      color="primary"
      selected={state}
      onClick={() => setState(!state)}
    >
      {value === undefined ? 'Uncontrolled' : 'Controlled'}
    </CheckToken>
  )
}

export const Default = Template.bind({})
Default.args = {}

export const Controlled = Template.bind({})
Controlled.args = {
  value: true,
  setValue: action('setValue'),
}
Controlled.parameters = {
  docs: {
    description: {
      story:
        'This is a controlled example, clicking does not change the value but registers the click in the actions',
    },
  },
}
