import { Button, Column, Input, Row } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { useTrackedState } from '.'

export interface UseTrackedStateDocsProps<T> {
  /** optional starting state */
  initialState?: T
}

/**
 * useTrackedState hook provides the standard `[value, setValue]` array with an additional object providing
 * `undo` and `redo` functions with convenience `boolean`s for `canUndo` and `canRedo`.
 *
 * @param initialState (optional) starting state or function to provide starting state
 */
export const UseTrackedStateDocs = <T extends any>(
  props: UseTrackedStateDocsProps<T>
) => null

export default {
  title: 'Hooks/useTrackedState',
  component: UseTrackedStateDocs,
  excludeStories: ['UseTrackedStateDocs'],
} as Meta

const Template: Story<UseTrackedStateDocsProps<number>> = ({
  initialState,
}) => {
  const [value, setValue, { undo, redo, canUndo, canRedo }] = useTrackedState(
    initialState
  )
  return (
    <Column gap>
      <Input label="Value" readOnly value={value} />
      <Row gap>
        <Button variant="primary" onClick={() => setValue(value + 1)}>
          +
        </Button>
        {/* As in setState, you can set the value with a new value (as above) or
         * a function (as below) that is provided the current value and should
         * return the new one */}
        <Button
          variant="primary"
          onClick={() => setValue((current) => --current)}
        >
          -
        </Button>
        <Button disabled={!canUndo} variant="primary" onClick={undo}>
          Undo
        </Button>
        <Button disabled={!canRedo} variant="primary" onClick={redo}>
          Redo
        </Button>
      </Row>
    </Column>
  )
}

export const Default = Template.bind({})
Default.args = {
  initialState: 0,
}
