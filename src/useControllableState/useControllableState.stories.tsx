import { Checkbox } from '@committed/components'
import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { useControllableState } from '.'

export interface UseControllableStateDocsProps<T> {
  /** The controlled value (of type T) or undefined for an uncontrolled value */
  value: T | undefined
  /** The dispatch handler for state changes or undefined for when an uncontrolled value, ignored if uncontrolled*/
  setValue:
    | React.Dispatch<React.SetStateAction<T>>
    | React.Dispatch<T>
    | undefined
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
    <Checkbox
      variant="primary"
      checked={state}
      onCheckedChange={() => setState(!state)}
      label={value === undefined ? 'Uncontrolled' : 'Controlled'}
    />
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

export const SetState = Template.bind({})
SetState.args = {
  value: true,
  setValue: (value: boolean | ((current: boolean) => void)) =>
    action('setState')(value),
}
SetState.parameters = {
  docs: {
    description: {
      story:
        'This is a controlled example, where both set and function set are supported',
    },
  },
}

export const SetValue = Template.bind({})
SetValue.args = {
  value: true,
  setValue: (value: boolean) => action('setValue')(value),
}
SetValue.parameters = {
  docs: {
    description: {
      story:
        'This is a controlled example, where only direct value is supported - this is allow but may lead to errors if clients attempt to use the function style set.',
    },
  },
}

export const WrappedExample = () => {
  const [state, setState] = useState(false)

  return <Template value={state} setValue={setState} />
}

export const WrappedExampleNoFunction = () => {
  const [state, setState] = useState(false)

  return <Template value={state} setValue={(value) => setState(value)} />
}
