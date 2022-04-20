import { Button, Paragraph } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { useInterval } from '.'

export interface UseIntervalDocsProps {
  /** The callback to be called */
  callback: (() => void) | null
  /** The time between calls (ms) */
  delay: number | null
}

/**
 * useInterval calls the callback at the given rate.
 *
 * Based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 */
export const UseIntervalDocs: React.FC<UseIntervalDocsProps> = () => null

export default {
  title: 'Hooks/useInterval',
  component: UseIntervalDocs,
  excludeStories: ['UseIntervalDocs'],
  argTypes: {
    callback: {},
    delay: {
      control: { type: 'range', min: 0, max: 1000, step: 100 },
    },
  },
} as Meta

const Template: Story<Omit<UseIntervalDocsProps, 'callback'>> = ({ delay }) => {
  const [count, setCount] = React.useState(0)
  useInterval(() => setCount(count + 1), delay)
  return <Paragraph>{count}</Paragraph>
}

export const Default = Template.bind({})
Default.args = { delay: 500 }

export const Pause = () => {
  const [delay, setDelay] = React.useState<null | number>(null)
  const [count, setCount] = React.useState(0)
  useInterval(() => setCount(count + 1), delay)
  return (
    <>
      <Paragraph>{count}</Paragraph>
      <Button
        color="primary"
        onClick={() => (delay === null ? setDelay(100) : setDelay(null))}
      >
        {delay === null ? 'Start' : 'Stop'}
      </Button>
    </>
  )
}
Pause.parameters = {
  docs: {
    description: {
      story: 'We can use a delay of `null` to pause the timmer',
    },
  },
}
