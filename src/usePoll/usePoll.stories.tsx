import {
  Button,
  Column,
  FormControl,
  Label,
  Paragraph,
  Slider,
} from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
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
  return <Paragraph>{count}</Paragraph>
}

export const Default = Template.bind({})
Default.args = { delay: 500 }

export const AwaitPromise = () => {
  const [callbackDelay, setCallbackDelay] = React.useState(1000)
  const [pollDelay, setPollDelay] = React.useState(500)
  const [count, setCount] = React.useState(0)

  const callback = React.useCallback(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, callbackDelay)
      }).then(() => {
        setCount((count) => count + 1)
      }),
    [callbackDelay, setCount]
  )
  usePoll(callback, pollDelay)

  return (
    <Column gap>
      <Paragraph size={3}>{`Counter: ${count}`}</Paragraph>
      <FormControl>
        <Label htmlFor="poll-slider">{`Poll Delay: ${pollDelay}`}</Label>
        <Slider
          id="poll-slider"
          variant="primary"
          value={[pollDelay]}
          onValueChange={(value) => setPollDelay(value[0])}
          step={100}
          min={0}
          max={1000}
        />
      </FormControl>
      <FormControl>
        <Label htmlFor="delay-slider">{`Handler Delay: ${callbackDelay}`}</Label>
        <Slider
          id="delay-slider"
          value={[callbackDelay]}
          onValueChange={(value) => setCallbackDelay(value[0])}
          step={100}
          min={0}
          max={1000}
        />
      </FormControl>
    </Column>
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
      <Paragraph>{count}</Paragraph>
      <Button
        variant="primary"
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
      <Paragraph size={3}>{`Counter: ${count}`}</Paragraph>
      {error && (
        <Paragraph css={{ color: '$error' }} size={3}>
          {`Error: ${error}`}
        </Paragraph>
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
