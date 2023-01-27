import { Button, Radio, RadioGroup, Row, Spinner } from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React, { ComponentProps } from 'react'
import { useModal } from '.'

export interface UseModalDocsProps {
  /** The start state for the toggle */
  defaultValue: boolean
}

/**
 * Utility hook for modal state
 *
 * returns the visibility of the modal and functions to `show` and `hide`.
 * Also, re-exposes the `set` function in case required.
 *
 */
export const UseModalDocs: React.FC<UseModalDocsProps> = (
  _props: UseModalDocsProps
) => null
UseModalDocs.defaultProps = { defaultValue: true }

export default {
  title: 'Hooks/useModal',
  component: UseModalDocs,
  excludeStories: ['UseModalDocs'],
} as Meta

type JustVariant<C> = C extends string ? C : never
type Variant = JustVariant<ComponentProps<typeof Spinner>['variant']>

const Template: Story<UseModalDocsProps> = ({ defaultValue }) => {
  const [visibility, show, hide] = useModal(defaultValue)
  return (
    <Row gap css={{ overflow: 'hidden' }}>
      <Button disabled={visibility} onClick={show}>
        Show
      </Button>
      <Button disabled={!visibility} onClick={hide}>
        Hide
      </Button>
      {visibility && <Spinner variant="spin" />}
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

export const SetState: Story = () => {
  const [animate, show, hide] = useModal(false)

  const [variant, setVariant] = React.useState<Variant>('spin' as Variant)

  return (
    <Row gap>
      <RadioGroup value={variant}>
        <Radio
          value="spin"
          onClick={() => setVariant('spin' as Variant)}
          label="Spin"
        />
        <Radio
          value="draw"
          onClick={() => setVariant('draw' as Variant)}
          label="Draw"
        />
        <Radio
          value="scale"
          onClick={() => setVariant('scale' as Variant)}
          label="Scale"
        />
      </RadioGroup>
      <Button disabled={animate} variant="primary" onClick={show}>
        Start
      </Button>
      <Button disabled={!animate} variant="primary" onClick={hide}>
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
        'The `show` and `hide` functions can be used in `onClick` directly',
    },
  },
}
