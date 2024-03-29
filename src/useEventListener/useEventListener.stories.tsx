import { Button, Paragraph } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React, { RefObject } from 'react'
import { useEventListener } from '.'

export interface UseEventListenerDocsProps<
  T extends HTMLElement = HTMLDivElement
> {
  /** the name of the event to listen to  */
  eventName: string
  /** the callback function to call on the event firing  */
  handler: ((event: Event) => void) | null
  /** (optional) reference for the element to add the listener to T extends `HTMLElement` and defaults to `HTMLDivElement` */
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
export const UseEventListenerDocs = <T extends HTMLElement>(
  props: UseEventListenerDocsProps<T>
) => null

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
  const divRef = React.useRef<HTMLButtonElement>(null)
  useEventListener(eventName, () => setCount(count + 1), divRef)
  return (
    <div>
      <Paragraph>{`Counter: ${count}`}</Paragraph>
      <Button ref={divRef} variant="primary">
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
  return <Paragraph>{`Mouse Position: ${x}, ${y}`}</Paragraph>
}
WindowAndEvents.parameters = {
  docs: {
    description: {
      story: `If a ref is not specified then we listen to the \`window\` (or, as here, the \`iframe\`).

The event is passed to the handler and can be the relevant generic extension of \`Event\`.`,
    },
  },
}
