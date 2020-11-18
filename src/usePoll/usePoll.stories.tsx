import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Typography, Button, Slider } from '@committed/components'
import { usePoll } from '.'

export interface UsePollDocsProps {
  /** The callback to be called */
  callback: (() => Promise<void>) | (() => void) | null
  /** The time between calls (ms) */
  delay: number | null
}

/**
 * Call the callback with a fixed delay (between completions)
 *
 * The first call will be made immediately.
 *
 * Based on https://www.aaron-powell.com/posts/2019-09-23-recursive-settimeout-with-react-hooks/
 *
 *
 * @param callback the callback
 * @param delay the time between calls (ms)
 * @param onError optional function called on error of the promise callback
 */
export const UsePollDocs: React.FC<UsePollDocsProps> = () => null

export default {
  title: 'Hooks/usePoll',
  component: UsePollDocs,
  excludeStories: ['UsePollDocs'],
  argTypes: {
    callback: {},
    delay: {
      control: { type: 'range', min: 0, max: 1000, step: 100 },
    },
  },
} as Meta

const Template: Story<Omit<UsePollDocsProps, 'callback'>> = ({ delay }) => {
  const [count, setCount] = React.useState(0)
  usePoll(() => setCount(count + 1), delay)
  return <Typography>{count}</Typography>
}

export const Default = Template.bind({})
Default.args = { delay: 500 }

export const AwaitPromise = () => {
  const [callbackDelay, setCallbackDelay] = React.useState(1000)
  const [pollDelay, setPollDelay] = React.useState(500)
  const [count, setCount] = React.useState(0)

  usePoll(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, callbackDelay)
      }).then(() => {
        setCount(count + 1)
      }),
    pollDelay
  )

  return (
    <>
      <Typography fontSize={3} mb={4}>
        {`Counter: ${count}`}
      </Typography>
      <Typography fontSize={3} mb={2}>
        {`Poll Delay: ${pollDelay}`}
      </Typography>
      <Slider
        color="primary"
        value={pollDelay}
        valueLabelDisplay="auto"
        // @ts-ignore (bug in components)
        onChange={(_e: any, value: number | number[]) =>
          setPollDelay(value as number)
        }
        step={100}
        min={0}
        max={1000}
        marks={true}
      />
      <Typography fontSize={3} mb={2}>
        {`Handler Delay: ${callbackDelay}`}
      </Typography>
      <Slider
        color="primary"
        value={callbackDelay}
        valueLabelDisplay="auto"
        // @ts-ignore (bug in components)
        onChange={(_e: any, value: number | number[]) =>
          setCallbackDelay(value as number)
        }
        step={100}
        min={0}
        max={1000}
      />
    </>
  )
}
AwaitPromise.parameters = {
  docs: {
    description: {
      story: 'We can use a delay of `null` to pause the timmer',
    },
  },
}

export const Pause = () => {
  const [delay, setDelay] = React.useState<null | number>(null)
  const [count, setCount] = React.useState(0)
  usePoll(() => setCount(count + 1), delay)
  return (
    <>
      <Typography>{count}</Typography>
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

export const HandleError = () => {
  const [error, setError] = React.useState('')
  const [count, setCount] = React.useState(0)

  usePoll(
    () =>
      new Promise((resolve, reject) => {
        if (count < 10) {
          setTimeout(resolve, 500)
        } else {
          reject(new Error('Too Big!'))
        }
      })
        .then(() => {
          setCount(count + 1)
        })
        .catch((e: Error) => setError(e.message)),
    500
  )

  return (
    <>
      <Typography fontSize={3} mb={4}>
        {`Counter: ${count}`}
      </Typography>
      {error && (
        <Typography color="error" fontSize={3} mb={4}>
          {`Error: ${error}`}
        </Typography>
      )}
      <Button
        onClick={() => {
          setError('')
          setCount(0)
        }}
      >
        Reset
      </Button>
    </>
  )
}
HandleError.parameters = {
  docs: {
    description: {
      story: 'The polling will stop if the promise throws an error.',
    },
  },
}
