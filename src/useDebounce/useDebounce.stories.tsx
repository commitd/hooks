import {
  Box,
  Button,
  Column,
  Heading,
  Input,
  Paragraph,
  Row,
  Slider,
  Text,
} from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import useSwr from 'swr'
import { useDebounce } from '.'

export interface UseDebounceDocsProps<T> {
  /** The value to debounce updates for */
  value: T
  /** The time to delay updates by (ms) */
  delay: number | null
}

/**
 * Debounce the update to a value
 *
 * The returned value will only update when the useDebounce hook has not been called for the full delay specified.
 *
 * A flush function is also returned so the value can be forced, say on dismount.
 *
 * Adapted from <https://usehooks.com/>, if more functionality or control is required use [use-debounce](https://github.com/xnimorz/use-debounce).
 *
 */
export const UseDebounceDocs = <T extends any>(
  props: UseDebounceDocsProps<T>
) => null

export default {
  title: 'Hooks/useDebounce',
  component: UseDebounceDocs,
  excludeStories: ['UseDebounceDocs'],
  argTypes: {
    delay: {
      control: { type: 'range', min: 0, max: 1000, step: 100 },
    },
    value: {
      control: null,
    },
  },
} as Meta

const Template: Story<UseDebounceDocsProps<string>> = ({ delay }) => {
  const [text, setText] = React.useState('Change me!')
  const [debounced] = useDebounce(text, delay)
  return (
    <Column gap>
      <Input
        value={text}
        label="Input"
        onValueChange={setText}
        enterKeyHint={undefined}
      />
      <Text>{`Debounced: ${debounced}`}</Text>
    </Column>
  )
}

export const Default = Template.bind({})
Default.args = { delay: 500 }

export const Instant = Template.bind({})
Instant.args = { delay: null }
Instant.parameters = {
  docs: {
    description: {
      story:
        'If the delay is null there will be no debounce. Vary the delay and see how that affects the number of API calls.',
    },
  },
}

export const Usage = () => {
  const [text, setText] = React.useState('United')
  const [calls, setCalls] = React.useState(0)
  const [delay, setDelay] = React.useState(500)
  const [debouncedName] = useDebounce(text, delay)
  const { data: countries } = useSwr<
    Array<{ name: string; alpha3Code: string }>
  >(
    ['https://restcountries.com/v2/name/', debouncedName],
    ([url, name]) => {
      setCalls(calls + 1)
      return fetch(`${url}${name.toLowerCase()}`).then((res) => res.json())
    },
    { refreshInterval: 0, shouldRetryOnError: false }
  )

  return (
    <Column>
      <Input
        label="Search countries"
        value={text}
        onValueChange={setText}
        enterKeyHint={undefined}
      />
      <Row spaced>
        <Box>
          <Heading>Data</Heading>
          <Text>{`Delay: ${delay}ms`}</Text>
          <Slider
            variant="primary"
            value={[delay]}
            onValueChange={(value) => setDelay(value[0])}
            step={100}
            min={0}
            max={1000}
          />
          <Text>Actual value: {text}</Text>
          <Text>Debounced value: {debouncedName}</Text>
          <Text>API calls: {calls}</Text>
        </Box>
        <Box>
          <Heading>Counties:</Heading>
          {countries && countries.length ? (
            <ul>
              {countries.map((country) => (
                <li key={country.alpha3Code}>
                  <Text>{country.name}</Text>
                </li>
              ))}
            </ul>
          ) : (
            <Text>No Countries Found</Text>
          )}
        </Box>
      </Row>
    </Column>
  )
}
Usage.parameters = {
  docs: {
    description: {
      story:
        'This example shows how the debounce may be used to regulate API calls.',
    },
  },
}

export const Flush = () => {
  const [text, setText] = React.useState('Lon')
  const [calls, setCalls] = React.useState(0)
  const [delay, setDelay] = React.useState(5000)
  const [debouncedName, flush] = useDebounce(text, delay)
  const { data: countries } = useSwr<
    Array<{ name: string; alpha3Code: string; capital: string }>
  >(
    ['https://restcountries.com/v2/capital/', debouncedName],
    ([url, name]) => {
      setCalls(calls + 1)
      return fetch(`${url}${name.toLowerCase()}`).then((res) => res.json())
    },
    { refreshInterval: 0, shouldRetryOnError: false }
  )

  return (
    <Column>
      <Row gap css={{ alignItems: 'flex-end' }}>
        <Input
          label="Search capital"
          value={text}
          onValueChange={setText}
          enterKeyHint={undefined}
        />
        <Button
          disabled={debouncedName === text}
          variant="primary"
          onClick={flush}
        >
          Search
        </Button>
      </Row>
      <Row spaced>
        <Box>
          <Heading>Data</Heading>
          <Text>{`Delay: ${delay}ms`}</Text>
          <Slider
            variant="primary"
            value={[delay]}
            onValueChange={(value) => setDelay(value[0])}
            step={1000}
            min={1000}
            max={10000}
          />
          <Paragraph>Actual value: {text}</Paragraph>
          <Paragraph>Debounced value: {debouncedName}</Paragraph>
          <Paragraph>API calls: {calls}</Paragraph>
        </Box>
        <Box>
          <Heading>Capitals:</Heading>
          {countries && countries.length ? (
            <ul>
              {countries.map((country) => (
                <li key={country.alpha3Code}>
                  <Text>{`${country.capital} (${country.name})`}</Text>
                </li>
              ))}
            </ul>
          ) : (
            <Text>No Countries Found</Text>
          )}
        </Box>
      </Row>
    </Column>
  )
}
Flush.parameters = {
  docs: {
    description: {
      story:
        'This example shows how the flush function can be used to force the value. This is added here to the search button, with an unusually long delay for demonstration purposes. This could be called on change of focus or on dismount',
    },
  },
}
