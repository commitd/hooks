import { Button, Radio, RadioGroup, Row, Spinner } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import { useBoolean } from '.'

export interface UseBooleanDocsProps {
  /** The start state for the toggle */
  defaultValue: boolean
}

/**
 * Utility hook for boolean state
 *
 * returns the value, an object containing function for toggle, setTrue and setFalse.
 *
 * __Use `toggle` with caution__, attaching to buttons can cause unintended consequences from double clicks.
 */
export const UseBooleanDocs: React.FC<UseBooleanDocsProps> = (
  _props: UseBooleanDocsProps
) => null
UseBooleanDocs.defaultProps = { defaultValue: true }

export default {
  title: 'Hooks/useBoolean',
  component: UseBooleanDocs,
  excludeStories: ['UseBooleanDocs'],
} as Meta

const Template: Story<UseBooleanDocsProps> = ({ defaultValue }) => {
  const [spin, { toggle, setTrue, setFalse }] = useBoolean(defaultValue)
  return (
    <Row gap css={{ overflow: 'hidden' }}>
      <Button variant="primary" onClick={toggle}>
        Toggle
      </Button>
      <Button disabled={spin} onClick={setTrue}>
        Start
      </Button>
      <Button disabled={!spin} onClick={setFalse}>
        Stop
      </Button>
      <Spinner variant="spin" active={spin} />
    </Row>
  )
}

export const Default = Template.bind({})
Default.args = { defaultValue: false }

export const DefaultTrue = Template.bind({})
DefaultTrue.args = { defaultValue: true }

DefaultTrue.parameters = {
  docs: {
    description: {
      story: 'The default start state can be set, and defaults to `false`',
    },
  },
}

type JustVariants<C> = C extends string ? C : never
type Variant = JustVariants<ComponentProps<typeof Spinner>['variant']>

export const SetState: Story = () => {
  const [animate, { setTrue: start, setFalse: stop }] = useBoolean(false)

  const [variant, setVariant] = React.useState<Variant>('spin' as Variant)

  return (
    <Row gap css={{ overflow: 'hidden' }}>
      <RadioGroup
        value={variant}
        onValueChange={(v) => setVariant(v as Variant)}
      >
        <Radio value="spin" label="Spin" />
        <Radio value="draw" label="Draw" />
        <Radio value="scale" label="Scale" />
      </RadioGroup>
      <Button disabled={animate} color="primary" onClick={start}>
        Start
      </Button>
      <Button disabled={!animate} color="primary" onClick={stop}>
        Stop
      </Button>
      <Spinner variant={variant} active={animate} />
    </Row>
  )
}

SetState.parameters = {
  docs: {
    description: {
      story:
        'The `setTrue` and `setFalse` functions can be used in `onClick` directly',
    },
  },
}
