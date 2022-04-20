import { Button, Column, Input, Row } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { useLocalState } from '.'

export interface UseLocalStateDocsProps<T> {
  /** The key to use in local storage */
  key: string
  /** An optional default value, or supplier */
  defaultValue?: T | (() => T)
  /** Custom serialization can be provided, defaults to `JSON.stringify` and `JSON.parse` */
  serialization?: {
    serialize: (state: T) => string
    deserialize: (serialized: string) => T
  }
}

/**
 * useLocalState hook behaves like `React.useState`, returning the state and a function to set the value.
 * In addition, the value is put in local storage against the given key and is persisted through page refresh.
 */
export const UseLocalStateDocs = <T extends any>(
  props: UseLocalStateDocsProps<T>
) => null

export default {
  title: 'Hooks/useLocalState',
  component: UseLocalStateDocs,
  excludeStories: ['UseLocalStateDocs'],
  argTypes: {
    key: {},
    defaultValue: {
      control: { type: null },
    },
    serialization: {
      control: {
        type: null,
      },
    },
  },
} as Meta

const Template: Story<UseLocalStateDocsProps<string>> = ({
  key,
  defaultValue,
}) => {
  const [value, setValue] = useLocalState(key, defaultValue)
  return (
    <Column gap>
      <Input
        label="Value"
        value={value}
        onValueChange={setValue}
        enterKeyHint={undefined}
      />
      <Button variant="primary" onClick={() => location.reload()}>
        Refresh page
      </Button>
    </Column>
  )
}

export const Default = Template.bind({})
Default.args = { key: 'useLocalStorage', defaultValue: '' }

export const WithDefault = Template.bind({})
WithDefault.args = {
  key: 'useLocalStorage:WithDefault',
  defaultValue: 'Default Value',
}
WithDefault.parameters = {
  docs: {
    description: {
      story:
        'A default value can be supplied or an initializer function. This is only used if local storage is empty',
    },
  },
}

export const WithClear = () => {
  const [value, setValue, clear] = useLocalState<string | undefined>(
    'useLocalStorage:WithClear',
    () => 'Supplied'
  )
  return (
    <Column gap>
      <Input
        label="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Row gap>
        <Button variant="primary" onClick={() => location.reload()}>
          Refresh page
        </Button>
        <Button destructive onClick={clear}>
          Clear
        </Button>
      </Row>
    </Column>
  )
}
WithClear.parameters = {
  docs: {
    description: {
      story:
        'You may want to keep a value in local storage until a certain event, say the user submitting a form. For this purpose we supply a `clear` function that can be called. This __does not__ affect the current value, and any subsequent change will be stored, but refresh will return to the default after clearing. In this story we put this function on a button so you can explore the behaviour',
    },
  },
}
