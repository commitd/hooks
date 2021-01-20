import {
  Box,
  Button,
  Column,
  Heading,
  Row,
  Slider,
  TextField,
  Typography,
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
    <>
      <TextField
        mb={3}
        value={text}
        label="Input"
        onChange={(e) => setText(e.target.value)}
      />
      <Typography>{`Debounced: ${debounced}`}</Typography>
    </>
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
    ['https://restcountries.eu/rest/v2/name/', debouncedName],
    (url: string, name: string) => {
      setCalls(calls + 1)
      return fetch(`${url}${name}`).then((res) => res.json())
    },
    { refreshInterval: 0, shouldRetryOnError: false }
  )

  return (
    <Column>
      <TextField
        label="Search countries"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Row>
        <Box width={1 / 2} p={2}>
          <Heading.h2>Data</Heading.h2>
          <Typography>{`Delay: ${delay}ms`}</Typography>
          <Slider
            color="primary"
            value={delay}
            valueLabelDisplay="auto"
            // @ts-ignore (bug in components)
            onChange={(_e: any, value: number | number[]) =>
              setDelay(value as number)
            }
            step={100}
            min={0}
            max={1000}
            marks={true}
          />
          <Typography>Actual value: {text}</Typography>
          <Typography>Debounced value: {debouncedName}</Typography>
          <Typography>API calls: {calls}</Typography>
        </Box>
        <Box width={1 / 2} p={2}>
          <Heading.h2>Counties:</Heading.h2>
          {countries && countries.length ? (
            <ul>
              {countries.map((country) => (
                <li key={country.alpha3Code}>
                  <Typography>{country.name}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No Countries Found</Typography>
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
    ['https://restcountries.eu/rest/v2/capital/', debouncedName],
    (url: string, name: string) => {
      setCalls(calls + 1)
      return fetch(`${url}${name}`).then((res) => res.json())
    },
    { refreshInterval: 0, shouldRetryOnError: false }
  )

  return (
    <Column>
      <Row>
        <TextField
          label="Search capital"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          disabled={debouncedName === text}
          color="primary"
          onClick={flush}
        >
          Search
        </Button>
      </Row>
      <Row>
        <Box width={1 / 2} p={2}>
          <Heading.h2>Data</Heading.h2>
          <Typography>{`Delay: ${delay}ms`}</Typography>
          <Slider
            color="primary"
            value={delay}
            valueLabelDisplay="auto"
            // @ts-ignore (bug in components)
            onChange={(_e: any, value: number | number[]) =>
              setDelay(value as number)
            }
            step={1000}
            min={1000}
            max={10000}
            marks={true}
          />
          <Typography>Actual value: {text}</Typography>
          <Typography>Debounced value: {debouncedName}</Typography>
          <Typography>API calls: {calls}</Typography>
        </Box>
        <Box width={1 / 2} p={2}>
          <Heading.h2>Capitals:</Heading.h2>
          {countries && countries.length ? (
            <ul>
              {countries.map((country) => (
                <li key={country.alpha3Code}>
                  <Typography>{`${country.capital} (${country.name})`}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No Countries Found</Typography>
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
