import { Meta, Story } from '@storybook/react'
import { Button, Typography } from '@committed/components'
import React, { RefObject } from 'react'
import { useEventListener } from '.'

export interface UseEventListenerDocsProps<
  T extends HTMLElement = HTMLDivElement
> {
  /** the name of the event to listen to  */
  eventName: string
  /** the callback function to call on the event firing  */
  handler: ((event: Event) => void) | null
  /** (optional) reference for the element to add the listener too */
  element?: RefObject<T>
}

/**
 * useEventListener hook adds an event listener to the given event type and calls the handler when fired.
 * The listener is added to the `window` by default or the target element if provided using a ref object.
 * It is removed automatically on unmounting.
 *
 * For event types reference see <https://developer.mozilla.org/en-US/docs/Web/Events>.
 *
 * (Derived from <https://usehooks-typescript.com/use-event-listener>)
 *
 * @param eventName the name of the event to listen to
 * @param handler the callback function
 * @param element (optional) reference for the element
 */
export const UseEventListenerDocs: React.FC<UseEventListenerDocsProps> = () =>
  null

export default {
  title: 'Hooks/useEventListener',
  component: UseEventListenerDocs,
  excludeStories: ['UseEventListenerDocs'],
  argTypes: {
    eventName: {
      description:
        'the name of the event to listen to (some examples to select from here)',
      defaultValue: 'click',
      control: {
        type: 'select',
        options: ['click', 'dblclick', 'auxclick', 'mouseenter', 'mouseout'],
      },
    },
    handler: {},
    element: { control: { type: 'none' } },
  },
} as Meta

const Template: Story<UseEventListenerDocsProps> = ({
  eventName,
}: UseEventListenerDocsProps) => {
  const [count, setCount] = React.useState(0)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  useEventListener(eventName, () => setCount(count + 1), buttonRef)
  return (
    <div>
      <Typography>{`Counter: ${count}`}</Typography>
      <Button ref={buttonRef} color="primary">
        {eventName}
      </Button>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {}

export const WindowAndEvents = () => {
  const [x, setX] = React.useState(0)
  const [y, setY] = React.useState(0)
  useEventListener('mousemove', (event: MouseEvent) => {
    setX(event.offsetX)
    setY(event.offsetY)
  })
  return <Typography>{`Mouse Position: ${x}, ${y}`}</Typography>
}
WindowAndEvents.parameters = {
  docs: {
    description: {
      story: `If a ref is not specified then we listen to the \`window\` (or, as here, the \`iframe\`).

The event is passed to the handler and can be the relevant generic extension of \`Event\`.`,
    },
  },
}
