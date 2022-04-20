import { Button, Paragraph, Row } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
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
    callback: {},
    delay: {
      control: { type: 'range', min: 0, max: 1000, step: 100 },
    },
  },
} as Meta

const Template: Story<UseTimeoutDocsProps> = ({ delay }) => {
  const [message, setMessage] = React.useState('Computing...')
  useTimeout(() => setMessage('Done!'), delay)
  return <Paragraph>{message}</Paragraph>
}

export const Default = Template.bind({})
Default.args = { delay: 500 }

export const Pause = () => {
  const [delay, setDelay] = React.useState<null | number>(null)
  const [count, setCount] = React.useState(0)
  useTimeout(() => setCount(count + 1), delay)
  return (
    <>
      <Paragraph>{count}</Paragraph>
      <Row gap>
        <Button
          variant="primary"
          onClick={() => (delay === null ? setDelay(100) : setDelay(delay * 2))}
        >
          {delay === null ? 'Start' : `Double delay (${delay})`}
        </Button>
        <Button
          variant="secondary"
          disabled={delay === null}
          onClick={() => setDelay(null)}
        >
          Reset
        </Button>
      </Row>
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
