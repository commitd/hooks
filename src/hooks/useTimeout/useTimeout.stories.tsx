import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Typography, Button } from '@committed/components'
import { useTimeout } from '.'

export interface UseTimeoutDocsProps {
  /** The callback to be called */
  callback: (() => void) | null
  /** The time between calls (ms) */
  delay: number | null
}

/**
 * useTimeout calls the callback after a given period of delay.
 *
 * Based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 */
export const UseTimeoutDocs: React.FC<UseTimeoutDocsProps> = () => null

export default {
  title: 'Hooks/useTimeout',
  component: UseTimeoutDocs,
  excludeStories: ['UseTimeoutDocs'],
  argTypes: {
    delay: {
      control: { type: 'range', min: 0, max: 1000, step: 100 },
    },
  },
} as Meta

const Template: Story<Omit<UseTimeoutDocsProps, 'callback'>> = ({ delay }) => {
  const [message, setMessage] = React.useState('Computing...')
  useTimeout(() => setMessage('Done!'), delay)
  return <Typography>{message}</Typography>
}

export const Default = Template.bind({})
Default.args = { delay: 500 }

export const Pause = () => {
  const [delay, setDelay] = React.useState<null | number>(null)
  const [count, setCount] = React.useState(0)
  useTimeout(() => setCount(count + 1), delay)
  return (
    <>
      <Typography>{count}</Typography>
      <Button
        color="primary"
        onClick={() => (delay === null ? setDelay(100) : setDelay(delay * 2))}
      >
        {delay === null ? 'Start' : `Double delay (${delay})`}
      </Button>
      <Button
        ml={2}
        color="secondary"
        disabled={delay === null}
        onClick={() => setDelay(null)}
      >
        Reset
      </Button>
    </>
  )
}
Pause.parameters = {
  docs: {
    description: {
      story:
        'A delay of `null` will not call the callback. Changing delay will reset or restart the timmer so the callback will get called again.',
    },
  },
}
