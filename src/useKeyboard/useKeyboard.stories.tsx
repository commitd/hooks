import {
  Button,
  FormControlLabel,
  Heading,
  Monospace,
  Row,
  Span,
  Switch,
  TextField,
  Typography,
} from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React, { useRef } from 'react'
import { KEYBOARD_MODIFIERS, Keys, useKeyboard } from '.'
import { useBoolean } from '../useBoolean/useBoolean'

export interface UseKeyboardDocsProps<T extends HTMLElement = HTMLDivElement> {
  /** The definition of the key filter.
   *
   * The basic definition is a string filter separated with the `+` e.g. `'a'` or `'ctrl+a'`
   *
   * An array can be provided with alternatives, so matching any filter in the array will call the handler.
   *
   * Finally, you can provide your own function `(event: KeyboardEvent) => boolean`  */
  keys: Keys
  /**
   * the callback function to call on a key event firing and passing the filter
   */
  handler: ((event: KeyboardEvent) => void) | null
  /** Options
   *
   * - __element__ provide a ref for the element to bind to (defaults to `window`) (T extends `HTMLElement`)
   * - __event__ the key event to listen to (defaults to `keydown`)
   * - __ignoreKey__ set `true` to turn off the `KeyCode` test no other match (defaults to `false`)
   * - __ignoreRepeat__ set `true` to ignore repeat events (defaults to `false`)
   */
  options?: {
    element?: React.RefObject<T>
    event?: 'keydown' | 'keyup'
    ignoreKey?: boolean
    ignoreRepeat?: boolean
  }
}

/**
 * useKeyboard hook to add a callback to be called on the use of the keyboard under specified circumstances.
 */
export const UseKeyboardDocs = <T extends HTMLElement = HTMLDivElement>(
  props: UseKeyboardDocsProps<T>
) => null

export default {
  title: 'Hooks/useKeyboard',
  component: UseKeyboardDocs,
  excludeStories: ['UseKeyboardDocs'],
  argTypes: {
    keys: { control: { type: 'text' } },
    handler: { control: null },
    options: { control: null },
  },
} as Meta

const Template: Story<UseKeyboardDocsProps<any>> = ({ keys }) => {
  const [pressed, { setTrue, setFalse }] = useBoolean(false)
  useKeyboard(keys, setTrue)
  useKeyboard(
    React.useCallback(() => true, []),
    setFalse,
    { event: 'keyup' }
  )
  return (
    <Button disabled={!pressed} color="primary">
      {keys}
    </Button>
  )
}

export const Default = Template.bind({})
Default.args = {
  keys: 'a',
}

const Indicate: React.FC<{ state: boolean }> = ({ state }) => (
  <Span bold={state} color={state ? 'textPrimary' : 'textSecondary'}>
    {`${state}`}
  </Span>
)

function createFilter(e: KeyboardEvent): string {
  const filter = []
  KEYBOARD_MODIFIERS.forEach((modifier) => {
    if (e.getModifierState(modifier)) {
      filter.push(modifier)
    }
  })
  if (e.key === '+') {
    filter.push('plus')
  } else if (e.key === ' ') {
    filter.push('space')
  } else if (e.key === 'Dead') {
    filter.push(e.code)
  } else if (!KEYBOARD_MODIFIERS.includes(e.key)) {
    filter.push(e.key)
  }

  return filter.join('+')
}

export const KeyFilters: Story = () => {
  const [pressed, setPressed] = React.useState<KeyboardEvent>()
  useKeyboard('', (e: KeyboardEvent) => {
    setPressed(e)
  })
  return (
    <div>
      <Heading.h2>
        {pressed === undefined ? 'Press a key' : createFilter(pressed)}
      </Heading.h2>
      <Typography>
        {'Key: '}
        <Span bold>{pressed?.key}</Span>
        {pressed?.repeat ? ' (Repeat)' : ''}
      </Typography>
      <Typography>
        {`Modifiers: `}
        <Span bold={pressed?.altKey}>Alt</Span>
        {', '}
        <Span bold={pressed?.ctrlKey}>Control</Span>
        {', '}
        <Span bold={pressed?.metaKey}>Meta</Span>
        {', '}
        <Span bold={pressed?.getModifierState('OS')}>OS</Span>
        {', '}
        <Span bold={pressed?.shiftKey}>Shift</Span>
      </Typography>
    </div>
  )
}
KeyFilters.parameters = {
  docs: {
    description: {
      // Formatting important
      story: `We show here a corresponding key filter for the current keys pressed.

Key filters are a \`+\` separated list of the keys that must be pressed.

- Ordering is not important.
- Only one main character is allowed (e.g. \`a+b\`, \`up+p\` not supported)
- Multiple modifiers can be used (e.g. \`meta+a\`, \`control+shift+o\`)
- Modifiers aliases can be used can be used (e.g. \`alt\`, \`ctrl\`, \`control\`, \`shift\`, \`meta\`, \`option\`)
- Key aliases can be used can be used (e.g. \`plus\`, \`space\`, \`up\`, \`down\`, \`left\`, \`right\`, \`esc\`)
- To listen to any key press use an empty filter (e.g. \`''\`)

Known Limitations:

- Minimal support for lock characters (e.g. \`CapsLock'\`, \`NumLock\`)
- \`shift\` is required when also required to type it, (e.g. \`shift+('\`, \`shift+$\`)
`,
    },
  },
}

export const KeysArray: Story = () => {
  const [pressed, setPressed] = React.useState<string>()
  useKeyboard(
    ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'],
    (e: KeyboardEvent) => {
      setPressed(e.key)
    }
  )
  return (
    <Heading.h2>
      {pressed === undefined ? 'Press a function key' : `Pressed ${pressed}`}
    </Heading.h2>
  )
}
KeysArray.parameters = {
  docs: {
    description: {
      story: `Alternatives can be supplied by using an array of key filters`,
    },
  },
}

export const Event: Story = () => {
  const [pressed, { setTrue, setFalse }] = useBoolean(false)
  useKeyboard('', setFalse, { event: 'keyup' })
  useKeyboard('', setTrue, { event: 'keydown' })

  return (
    <div>
      <Heading.h2>{pressed ? 'Key down' : `Key up`}</Heading.h2>
    </div>
  )
}
Event.parameters = {
  docs: {
    description: {
      story:
        'By default we use the `keydown` event but you can specify the `keyup` event in the options.',
    },
  },
}

export const Repeat: Story = () => {
  const [repeat, setRepeat] = React.useState(0)
  const [single, setSingle] = React.useState(0)
  useKeyboard('q', (e: KeyboardEvent) => setRepeat((current) => ++current), {
    ignoreRepeat: false,
  })
  useKeyboard('q', (e: KeyboardEvent) => setSingle((current) => ++current), {
    ignoreRepeat: true,
  })
  return (
    <div>
      <Typography>Press and hold 'q'</Typography>
      <Typography>
        {`${repeat} events with `}
        <Monospace component="span">{`{ignoreRepeat: false}`}</Monospace>
        {'(default)'}
      </Typography>
      <Typography>
        {`${single} events with `}
        <Monospace component="span">{`{ignoreRepeat: true}`}</Monospace>
      </Typography>
    </div>
  )
}
Repeat.parameters = {
  docs: {
    description: {
      story:
        'By default the handler is also called for repeat keyboard events, setting the option `ignoreRepeat` will not count repeat calls.',
    },
  },
}

export const KeyOption: Story = () => {
  const [ignoreKey, { toggle }] = useBoolean(false)
  const [i, { setTrue: setITrue, setFalse: setIFalse }] = useBoolean(false)
  const [
    ctrlalti,
    { setTrue: setCtrlaltiTrue, setFalse: setCtrlaltiFalse },
  ] = useBoolean(false)

  useKeyboard('I', setITrue, { ignoreKey })
  useKeyboard('ctrl+alt+i', setCtrlaltiTrue, { ignoreKey })
  useKeyboard(
    '',
    (e: KeyboardEvent) => {
      setIFalse()
      setCtrlaltiFalse()
    },
    { event: 'keyup' }
  )
  return (
    <Row>
      <Button disabled={!i} color="primary">
        I
      </Button>
      <Button disabled={!ctrlalti} color="primary" mx={2}>
        ctrl+alt+i
      </Button>
      <FormControlLabel
        control={<Switch onChange={toggle} value={ignoreKey} color="primary" />}
        label="ingoreKey"
      />
    </Row>
  )
}
KeyOption.parameters = {
  docs: {
    description: {
      story: `In order to behave more as expected, if the match fails we (by default) also try the to match against the keyCode.
For example, this will match the filter \`I\` with the \`i\` key and help with some cases where the combination naturally returns the \`Dead\` key. (e.g. \`ctrl+alt+i\`).
However, this can lead to some undesired edge cases so it can be turned off with the \`ignoreKey\` option.

Experiment with this example by toggling the option and trying different key combinations (hint try \`i\` with \`CapsLock\`).
`,
    },
  },
}

export const BoundToElement: Story = () => {
  const inputRef = useRef<HTMLInputElement>()
  const [value, setValue] = React.useState('')
  const [pressed, setPressed] = React.useState('')
  useKeyboard(
    '',
    (e: KeyboardEvent) => {
      setPressed(e.key)
      setValue((last) =>
        e.key === 'Escape' ? '' : last + ' ' + createFilter(e)
      )
      e.preventDefault()
      e.stopPropagation()
    },
    { element: inputRef }
  )
  return (
    <div>
      <TextField
        value={value}
        innerRef={inputRef}
        multiline
        label="Type"
        placeholder="Will show key presses as filters, press esc to clear."
      />
    </div>
  )
}
BoundToElement.parameters = {
  docs: {
    description: {
      story:
        'An element can be provided to scope the listener to events from that element. By default the listener is added to the window.',
    },
  },
}
